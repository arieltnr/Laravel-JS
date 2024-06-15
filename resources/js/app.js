import $ from 'jquery';
import 'datatables.net';

function dateTime(datetime) {
    const today = new Date(datetime);
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = dd + '-' + mm + '-' + yyyy;
    return formattedToday;
}

function showAllData() {
    const url = `${window.apiBaseUrl}/barangs/`;
    $.ajax({
        url: url,
        type: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        success: function (result) {
            if (result.status === 200) {
                createTable(result.data);
            } else {
                console.log(result.message);
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function createTable(barangs) {
    var tableBody = $('#barangTable tbody');
    tableBody.empty(); // Clear any existing data

    barangs.forEach(function (item, idx) {
        let no = idx + 1;
        let tgltransaksi = dateTime(item.tgl_transaksi);

        var row = `<tr>
            <td>${no}</td>
            <td>${item.nama_barang}</td>
            <td>${item.stok}</td>
            <td>${item.jml_jual}</td>
            <td>${tgltransaksi}</td>
            <td>${item.jenis_barang}</td>
            <td><button class="btn btn-danger deleteBtn" data-id="${item.id}">Hapus</button></td>
        </tr>`;

        tableBody.append(row);
    });

    $('#barangTable').DataTable(); // Initialize DataTables plugin
    $('.deleteBtn').click(function () {
        var id = $(this).data('id');
        deleteData(id);
    });
}

function addData(formData) {
    const url = `${window.apiBaseUrl}/barangs/`;
    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(formData),
        contentType: 'application/json',
        success: function (result) {
            if (result.status === 200) {
                console.log(result.message);
                showAllData(); // Refresh table data after successful addition
            } else {
                console.log(result.message);
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function deleteData(id) {
    const url = `${window.apiBaseUrl}/barangs/${id}`;
    $.ajax({
        url: url,
        type: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        success: function (result) {
            if (result.status === 200) {
                console.log(result.message);
                showAllData(); // Refresh table data after successful deletion
            } else {
                console.log(result.message);
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

$(document).ready(function () {
    showAllData();

    $('#addForm').submit(function (event) {
        event.preventDefault();
        const formData = {
            nama_barang: $('#nama_barang').val(),
            stok: $('#stok').val(),
            jml_jual: $('#jml_jual').val(),
            tgl_transaksi: $('#tgl_transaksi').val(),
            jenis_barang: $('#jenis_barang').val()
        };
        addData(formData); // Send formData as a JSON object
    });

    $('#toggleFormBtn').click(function () {
        $("#formContainer").slideToggle(300, function () {
            if ($(this).is(':visible')) {
                $("#formContainer").load('/tambah-barang');
            }
        });
    });

    // Submit form handler (you can implement this part as per your requirement)
    $('#formContainer').on('submit', '#addForm', function (event) {
        event.preventDefault();
        const formData = {
            nama_barang: $('#nama_barang').val(),
            stok: $('#stok').val(),
            jml_jual: $('#jml_jual').val(),
            tgl_transaksi: $('#tgl_transaksi').val(),
            jenis_barang: $('#jenis_barang').val()
        };
        addData(formData);
    });
});
