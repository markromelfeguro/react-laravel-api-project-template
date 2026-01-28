<?php

namespace App\Http\Requests;

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
        $targetId = $this->route('id');

        return $currentUser->role === 'admin' || $currentUser->id == $targetId;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'   => ['required', 'string', 'max:255'],
            'bio'    => ['nullable', 'string'],
            'phone'  => ['nullable', 'string', 'phone:PH,INTERNATIONAL', 'max:20'],
            'avatar' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:30000'],
            'role'   => [
                Auth::user()->role === 'admin' ? 'nullable' : 'prohibited', 
                'string', 
                'in:user,admin'
            ],
        ];
    }
    public function messages(): array
    {
        return [
            'phone.phone' => 'The provided number is not a valid contact format for the Philippines or international protocols.',
            'phone.max'   => 'The contact number must not exceed 20 characters.',
            'role.prohibited' => 'You are not authorized to modify security roles.',
            'avatar.image' => 'The avatar must be a valid image file.',
            'avatar.mimes' => 'The system only accepts .jpeg, .png, and .jpg protocols for visual assets.',
            'avatar.max'   => 'The avaatar must not exceed 30MB.',
        ];
    }
}
