<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $currentUser = Auth::user();
        $targetId = $this->route('slug');

        if (in_array($currentUser->role, ['superadmin', 'admin'])) {
            return true;
        }

        return $currentUser->id == $targetId;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $slug = $this->route('slug');
        $userId = User::where('id', $slug)->value('id');

        return [
            'name'   => ['required', 'string', 'max:255'],
            'email' => [
                'nullable',          
                'email',                
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'role'   => [
                in_array(Auth::user()->role, ['superadmin', 'admin']) ? 'nullable' : 'prohibited',
                'string', 
                'in:superadmin,admin,customer'
            ],
            'bio'    => ['nullable', 'string'],
            'phone'  => ['nullable', 'string', 'phone:PH,INTERNATIONAL', 'max:20'],
            'avatar' => ['nullable', 'image', 'max:30000'],
        ];
    }
    public function messages(): array
    {
        return [
            'phone.phone' => 'The provided number is not a valid contact format for the Philippines or international protocols.',
            'phone.max'   => 'The contact number must not exceed 20 characters.',
            'role.prohibited' => 'You are not authorized to modify security roles.',
            'avatar.image' => 'The avatar must be a valid image file.',
            'avatar.max'   => 'The avaatar must not exceed 30MB.',
        ];
    }
}
