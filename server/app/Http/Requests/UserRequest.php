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
            'avatar' => ['nullable', 'image', 'dimensions:max_width=5000,max_height=5000', 'max:51200'],
        ];
    }
    public function messages(): array
    {
        return [
            'phone.phone' => 'The provided number is not a valid contact format for the Philippines or international protocols.',
            'phone.max'   => 'The contact number must not exceed 20 characters.',
            'role.prohibited' => 'You are not authorized to modify security roles.',
            
            'avatar.image' => 'The profile picture must be a valid image file (jpeg, png, bmp, gif, or svg).',
            'avatar.max'   => 'The image size is too large. Please upload an avatar smaller than 30MB.',
            'avatar.mimes' => 'The profile picture must be a format of: jpeg, png, jpg, or gif.',
            'avatar.uploaded' => 'The file is too large for the server to process. Please try a smaller image.',
        ];
    }
}
