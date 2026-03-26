<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;

class UserController extends Controller
{
    // GET /api/users
    public function index()
    {
        $users = User::orderBy('created_at', 'desc')->get();

        return response()->json($users, 200);
    }

    // POST /api/users
    public function store(StoreUserRequest $request)
    {
        $user = User::create($request->validated());

        return response()->json($user, 201);
    }

    // GET /api/users/{id}
    public function show(User $user)
    {
        return response()->json($user, 200);
    }

    // PUT /api/users/{id}
    public function update(UpdateUserRequest $request, User $user)
    {
        $user->update($request->validated());

        return response()->json($user, 200);
    }

    // DELETE /api/users/{id}
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => 'Usuario eliminado correctamente'
        ], 200);
    }
}