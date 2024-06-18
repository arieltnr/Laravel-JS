<?php

namespace App\Http\Controllers\Api;

use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;



class BarangController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/barangs",
     *     tags={"Projects"},
     *     @OA\Response(response="200", description="Display a listing of barangs.")
     * )
     */
    public function index()
    {
        $status = Response::HTTP_NO_CONTENT;
        $message = 'Belum Ada List Barang!';
        $data = NULL;

        $barang = Barang::latest()->get();

        if (!$barang->isEmpty()) {
            $status = Response::HTTP_OK;
            $message = 'Daftar List Barang';
            $data = $barang;
        }

        return response()->json([
            'status' => $status,
            'message' => $message,
            'data' => $data
        ]);
    }


    /**
     * @OA\Post(
     *     path="/api/barangs",
     *     tags={"Projects"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="nama_barang", type="string"),
     *             @OA\Property(property="stok", type="integer"),
     *             @OA\Property(property="jml_jual", type="integer"),
     *             @OA\Property(property="tgl_transaksi", type="string", format="timestamp"),
     *             @OA\Property(property="jenis_barang", type="string")
     *         )
     *     ),
     *     @OA\Response(response="201", description="Create a new item.")
     * )
     */
    public function store(Request $request)
    {
        $status = Response::HTTP_INTERNAL_SERVER_ERROR;
        $message = 'Barang Gagal Disimpan!';
        $data = NULL;

        $validator = Validator::make($request->all(), [
            'nama_barang' => 'required',
            'stok' => 'required',
            'jml_jual' => 'required',
            'tgl_transaksi' => 'required',
            'jenis_barang' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $barang = Barang::create([
            'nama_barang' => $request->nama_barang,
            'stok' => $request->stok,
            'jml_jual' => $request->jml_jual,
            'tgl_transaksi' => $request->tgl_transaksi,
            'jenis_barang' => $request->jenis_barang
        ]);

        if ($barang) {
            $status = Response::HTTP_OK;
            $message = 'Data Barang Berhasil Ditambahkan!';
            $data = $barang;
        }

        return response()->json([
            'status' => $status,
            'message' => $message,
            'data' => $data
        ]);
    }


    /**
     * @OA\Get(
     *     path="/api/barangs/{id_barang}",
     *     tags={"Projects"},
     *     @OA\Parameter(
     *         name="id_barang",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response="200", description="Display the specified item.")
     * )
     */
    public function show($id)
    {
        $status = Response::HTTP_NOT_FOUND;
        $message = 'Data Barang Tidak Ditemukan!';
        $data = NULL;

        $barang = Barang::find($id);

        if ($barang) {
            $status = Response::HTTP_OK;
            $message = 'Data Barang Ditemukan!';
            $data = $barang;
        }

        return response()->json([
            'status' => $status,
            'message' => $message,
            'data' => $data
        ]);
    }


    /**
     * @OA\Put(
     *     path="/api/barangs/{id_barang}",
     *     tags={"Projects"},
     *     @OA\Parameter(
     *         name="id_barang",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="nama_barang", type="string"),
     *             @OA\Property(property="stok", type="integer"),
     *             @OA\Property(property="jml_jual", type="integer"),
     *             @OA\Property(property="tgl_transaksi", type="string", format="date"),
     *             @OA\Property(property="jenis_barang", type="string")
     *         )
     *     ),
     *     @OA\Response(response="200", description="Update the specified item.")
     * )
     */
    public function update(Request $request, Barang $barang)
    {
        $status = Response::HTTP_INTERNAL_SERVER_ERROR;
        $message = 'Barang Gagal Diubah!';
        $data = NULL;

        $validator = Validator::make($request->all(), [
            'nama_barang' => 'required',
            'stok' => 'required',
            'jml_jual' => 'required',
            'tgl_transaksi' => 'required',
            'jenis_barang' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $barang->update([
            'nama_barang' => $request->nama_barang,
            'stok' => $request->stok,
            'jml_jual' => $request->jml_jual,
            'tgl_transaksi' => $request->tgl_transaksi,
            'jenis_barang' => $request->jenis_barang
        ]);

        if ($data) {
            $status = Response::HTTP_OK;
            $message = 'Data Barang Berhasil Diubah!';
            $barang = $data;
        }

        return response()->json([
            'status' => $status,
            'message' => $message,
            'data' => $data
        ]);
    }


    /**
     * @OA\Delete(
     *     path="/api/barangs/{id_barang}",
     *     tags={"Projects"},
     *     @OA\Parameter(
     *         name="id_barang",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response="204", description="Delete the specified item.")
     * )
     */
    public function destroy($id)
    {
        $status = Response::HTTP_INTERNAL_SERVER_ERROR;
        $message = 'Data Barang Gagal Dihapus!';
        $data = NULL;

        $barang = Barang::find($id);

        if ($barang) {
            $status = Response::HTTP_OK;
            $message = 'Data Barang Berhasil Dihapus!';
            $data = $barang->delete();
        }

        return response()->json([
            'status' => $status,
            'message' => $message,
            'data' => $data
        ]);
    }

}
