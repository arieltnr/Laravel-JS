<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'nama_barang',
        'stok',
        'jml_jual',
        'tgl_transaksi',
        'jenis_barang'
    ];
}
