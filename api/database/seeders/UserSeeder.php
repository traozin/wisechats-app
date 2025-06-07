<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder {
    public function run(): void {
        $users = [
            [
                'id' => Str::uuid(),
                'name' => 'Antonio Neto',
                'email' => 'antonio.neto@example.com',
                'password' => Hash::make('123456'),
                'email_verified_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Beatriz Souza',
                'email' => 'beatriz.souza@example.com',
                'password' => Hash::make('123456'),
                'email_verified_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Carlos Henrique',
                'email' => 'carlos.henrique@example.com',
                'password' => Hash::make('123456'),
                'email_verified_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Daniela Lima',
                'email' => 'daniela.lima@example.com',
                'password' => Hash::make('123456'),
                'email_verified_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Eduardo Tavares',
                'email' => 'eduardo.tavares@example.com',
                'password' => Hash::make('123456'),
                'email_verified_at' => now(),
            ],
        ];

        DB::table('users')->insert($users);
    }
}
