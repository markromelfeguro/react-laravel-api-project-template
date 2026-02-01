import { useState, useEffect, useMemo, useCallback } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import {
  Button,
  Checkbox,
  SearchInput, 
  LoadingSpinner,
  Modal,
  Table, TableHeader, TableBody, TableRow, TableCell, TablePagination,
} from "../../components/ui";
import { notify } from "../../utils/notify";
import UserService from "../../features/users/api/UserService";
import type { User } from "../../features/users/types/user.types";
import { useSearchHistory } from "../../hooks/useSearchHistory";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { suggestions, setSuggestions, deleteSearch } = useSearchHistory('App\\Models\\User');
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'name',
    direction: 'asc'
  });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await UserService.getAll({
        search: searchQuery,
        page: currentPage,
        limit: pageSize
      });
      if (response) {
        setUsers(response.data.users);
        setSuggestions(response.data.suggestions);
        setTotalResults(response.data.total || 0);
      }
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  }, [searchQuery, currentPage, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, currentPage, pageSize, fetchUsers]);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const processedUserData = useMemo(() => {
    let items = [...users];
    items.sort((a: any, b: any) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return items; 
  }, [users, sortConfig]);

  const totalPages = Math.ceil(totalResults / pageSize);

  //SELECTION
  // Toggle single user
  const toggleUserSelection = (userId: number) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  // Toggle all users on current page
  const toggleAllOnPage = () => {
    const pageIds = processedUserData.map(u => u.id);
    const allSelected = pageIds.every(id => selectedUserIds.includes(id));
    
    if (allSelected) {
      setSelectedUserIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedUserIds(prev => [...new Set([...prev, ...pageIds])]);
    }
  };
  //SELECTION

  //HANDLE ACTION
  const confirmSingleDelete = (id: number) => {
    setDeleteTarget([id]);
    setIsModalOpen(true);
  };

  const confirmBulkDelete = () => {
    setDeleteTarget(selectedUserIds);
    setIsModalOpen(true);
  };

  const executeDeletion = async () => {
    setIsDeleting(true);
    try {
      // API Call: await UserService.batchDelete(deleteTarget);
      
      notify.success(`${deleteTarget.length} account(s) permanently purged.`);
      
      setSelectedUserIds(prev => prev.filter(id => !deleteTarget.includes(id)));
      
      setDeleteTarget([]);
      
      fetchUsers();
    } catch (error) {
      notify.error("Decommissioning failed.");
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };
  //HANDLE ACTION

  const content = (
    <div className="space-y-8 pb-20 animate-reveal">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-96">
          <SearchInput 
            suggestions={suggestions}
            placeholder="Search name, email, or role..."
            onDeleteSuggestion={deleteSearch}
            onSelect={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
            }}
          />
        </div>
        <Button variant="primary" iconName="person_add">Add User</Button>
      </div>

      <div className="bg-surface rounded-3xl border border-border shadow-main overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className={`transition-all duration-300 ${selectedUserIds.length > 0 ? 'bg-primary/10' : ''}`}>
              <TableCell className="w-10">
                <Checkbox 
                  checked={processedUserData.length > 0 && processedUserData.every(u => selectedUserIds.includes(u.id))}
                  onChange={toggleAllOnPage}
                />
              </TableCell>

              {selectedUserIds.length > 0 ? (
                /* --- RENDER THIS WHEN ITEMS ARE SELECTED --- */
                <TableCell colSpan={4} className="py-2">
                  <div className="flex items-center justify-between animate-in slide-in-from-left-2 duration-300">
                    <span className="text-[10px] font-black uppercase italic tracking-widest text-primary">
                      {selectedUserIds.length} User(s) Selected
                    </span>
                    <div className="flex px-2 gap-2">
                      <Button variant="secondary" size="sm" className="font-bold text-[10px]" onClick={() => setSelectedUserIds([])}>
                        Cancel
                      </Button>
                      <Button onClick={confirmBulkDelete} variant="danger" size="sm" iconName="delete_sweep" className="text-[10px]">
                        Delete Selected
                      </Button>
                    </div>
                  </div>
                </TableCell>
              ) : (
                /* --- RENDER STANDARD HEADERS --- */
                <>
                  <TableCell isHeader sortKey="name" currentSort={sortConfig} onSort={handleSort}>Name</TableCell>
                  <TableCell isHeader sortKey="email" currentSort={sortConfig} onSort={handleSort}>Email</TableCell>
                  <TableCell isHeader sortKey="role" currentSort={sortConfig} onSort={handleSort}>Role</TableCell>
                  <TableCell isHeader>Actions</TableCell>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-24">
                  <div className="flex items-center justify-center w-full">
                    <LoadingSpinner size="lg" text="Getting Users..."/>
                  </div>
                </TableCell>
              </TableRow>
            ) : processedUserData.length > 0 ? (
              processedUserData.map((user) => (
                <TableRow key={user.id} className={selectedUserIds.includes(user.id) ? 'bg-primary/5' : 'hover:bg-primary/5'}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                    />
                  </TableCell>
                  <TableCell className="font-bold italic text-primary">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="uppercase text-[10px] font-bold tracking-widest">
                    <span className={`${user.role}`}>{user.role}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="md" iconName="edit" className="text-blue-500! hover:bg-blue-500/10!" tooltip="Edit"/>
                      <Button onClick={() => confirmSingleDelete(user.id)} variant="ghost" size="md" iconName="delete" className="text-red-500 hover:bg-red-500/10!" tooltip="Delete"/>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center text-muted uppercase italic font-bold">
                  <div className="flex items-center justify-center w-full">
                      <p>No records found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={deleteTarget.length > 1 ? "Bulk Purge Confirmation" : "Confirm Deletion"}
        size="md"
        primaryAction={{
          label: "Yes, Delete it.",
          variant: "danger",
          iconName: "delete_forever",
          isLoading: isDeleting,
          onClick: executeDeletion
        }}
        secondaryAction={{
          label: "No, Cancel",
          onClick: () => setIsModalOpen(false)
        }}>
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm italic opacity-70">
              The following record(s) will be permanently decommissioned:
            </p>
            
            <div className="p-4 bg-main-bg border border-border rounded-2xl max-h-40 overflow-y-auto">
              {deleteTarget.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {users
                    .filter(user => deleteTarget.includes(user.id))
                    .map(user => (
                      <span 
                        key={user.id} 
                        className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-black uppercase italic rounded-lg border border-red-500/20">
                        {user.name}
                      </span>
                    ))}
                </div>
              ) : (
                <p className="text-xs text-muted italic text-center">No users identified for deletion.</p>
              )}
            </div>
          </div>

          <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
            <p className="text-[10px] uppercase font-black tracking-tighter text-red-500 italic text-center">
              Warning: This action is irreversible. All profile data for these accounts will be erased.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );

  return <MainLayout content={content} />;
};

export default UserManagement;