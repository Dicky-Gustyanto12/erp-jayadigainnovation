<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'dickygustyanto12@gmail.com')],
            [
                'name' => 'Dicky Gustyanto',
                'password' => bcrypt(env('ADMIN_PASSWORD', 'rahasia123')),
            ]
        );
    }       
}
