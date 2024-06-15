<form id="addForm" class="row">
    <div class="col-md-6">
        <div class="form-group">
            <label for="nama_barang">Nama Barang</label>
            <input type="text" class="form-control" id="nama_barang" name="nama_barang" required>
        </div>
        <div class="form-group">
            <label for="stok">Stok</label>
            <input type="number" class="form-control" id="stok" name="stok" required>
        </div>
        <div class="form-group">
            <label for="jml_jual">Jumlah Terjual</label>
            <input type="number" class="form-control" id="jml_jual" name="jml_jual" required>
        </div>
    </div>
    <div class="col-md-6">
        <div class="form-group">
            <label for="tgl_transaksi">Tanggal Transaksi</label>
            <input type="date" class="form-control" id="tgl_transaksi" name="tgl_transaksi" required>
        </div>
        <div class="form-group">
            <label for="jenis_barang">Jenis Barang</label>
            <input type="text" class="form-control" id="jenis_barang" name="jenis_barang" required>
        </div>
    </div>
    <div class="form-group col-12">
        <button type="submit" class="btn btn-warning">Simpan</button>
    </div>
</form>
