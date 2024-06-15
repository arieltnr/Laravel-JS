<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Laravel</title>

    @vite('resources/css/app.css') {{-- Include CSS --}}

    <script>
        window.apiBaseUrl = @json(config('api.base_url'));
    </script>

</head>

<body class="antialiased">

    <div class="container">

        <a href="{{ config('api.base_url') }}/documentation" target="_blank" class="btn btn-success">Dokumentasi API</a>

        <div class="row">

            <center>
                <h3>Daftar Barang</h3>
            </center>

            <div id="tableContainer">
                <table class="table" id="barangTable">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Nama Barang</th>
                            <th>Stok</th>
                            <th>Jumlah Terjual</th>
                            <th>Tanggal Transaksi</th>
                            <th>Jenis Barang</th>
                            <th>Hapus</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Data will be populated here via JavaScript -->
                    </tbody>
                </table>
            </div>


            <!-- Button to toggle form -->
            <center><button type="button" id="toggleFormBtn" class="btn btn-primary">Tambah Barang</button></center>
            <div id="formContainer" class="form-container"></div>

        </div>
    </div>

    @vite('resources/js/app.js') {{-- Include JS --}}
</body>

</html>