<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ViolationsAndAccidentsSeeder extends Seeder
{
    public function run(): void
    {
        $startDate = strtotime('2025-01-01');
        $endDate = strtotime('2025-08-25');

        // 250 مخالفة
        for ($i = 0; $i < 250; $i++) {
            $randomTimestamp = date(
                'Y-m-d H:i:s',
                mt_rand($startDate, $endDate)
            );

            DB::table('violations')->insert([
                'v_id' => Str::uuid(),
                'v_type_id' => $this->getRandomVTypeUUID(),
                'camera_id' => (string) rand(1, 16),
                'plate_num' => strtoupper(Str::random(3)).rand(1000, 9999),
                'timestamp' => $randomTimestamp,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 100 حادث
        for ($i = 0; $i < 100; $i++) {
            $randomTimestamp = date(
                'Y-m-d H:i:s',
                mt_rand($startDate, $endDate)
            );

            DB::table('accidents')->insert([
                'id' => Str::uuid(),
                'camera_id' => (string) rand(1, 16),
                'timestamp' => $randomTimestamp,
                'status' => 'viewed',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function getRandomVTypeUUID()
    {
        $ids = DB::table('violation_types')->pluck('v_type_id')->toArray();
        if (empty($ids)) {
            for ($i = 1; $i <= 5; $i++) {
                DB::table('violation_types')->insert([
                    'v_type_id' => Str::uuid(),
                    'type_name' => 'Type '.$i,
                    'key' => 'type_'.$i,
                    'fine_amount' => rand(50, 500) * 10,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
            $ids = DB::table('violation_types')->pluck('v_type_id')->toArray();
        }

        return $ids[array_rand($ids)];
    }
}
