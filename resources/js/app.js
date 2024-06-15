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

function showDataBy(id) {
    const url = `${window.apiBaseUrl}/barangs/${id}`;
    $.ajax({
        url: url,
        type: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        success: function (result) {
            if (result.status === 200) {
                populateForm(result.data);
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
            <td>
                <button class="btn btn-primary editBtn" data-id="${item.id}">Edit</button>
                <button class="btn btn-danger deleteBtn" data-id="${item.id}">Hapus</button>
            </td>
        </tr>`;

        tableBody.append(row);
    });

    $('#barangTable').DataTable(); // Initialize DataTables plugin

    $('.deleteBtn').click(function () {
        var id = $(this).data('id');
        if (confirm('Hapus Barang Ini?')) {
            deleteData(id);
        }
    });

    $('.editBtn').click(function () {
        var id = $(this).data('id');
        openForm(id);
    });
}

function addData(formData, isUpdate = false) {
    const url = isUpdate ? `${window.apiBaseUrl}/barangs/${formData.id}` : `${window.apiBaseUrl}/barangs/`;
    const type = isUpdate ? "PUT" : "POST";
    let msg = "Disimpan";

    if (type == "PUT") {
        msg = "Diubah";
    }

    $.ajax({
        url: url,
        type: type,
        data: JSON.stringify(formData),
        contentType: 'application/json',
        success: function (result) {
            if (result.status === 200) {
                console.log(result.message);
                alert('Data Berhasil ' + msg);
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

function openForm(id) {
    $("#formContainer").slideToggle(300, function () {
        if ($(this).is(':visible')) {
            $("#formContainer").load('/tambah-barang');
            showDataBy(id); // Fetch data to edit
        }
    });
}

function populateForm(data) {
    let tgltransaksi = dateTime(data.tgl_transaksi);

    $('#nama_barang').val(data.nama_barang);
    $('#stok').val(data.stok);
    $('#jml_jual').val(data.jml_jual);
    $('#tgl_transaksi').val(tgltransaksi);
    $('#jenis_barang').val(data.jenis_barang);
    $('#addForm').data('id', data.id); // Save the id in the form data
}

$(document).ready(function () {
    showAllData();

    $('#addForm').submit(function (event) {
        event.preventDefault();
        const formData = {
            id: $(this).data('id'),
            nama_barang: $('#nama_barang').val(),
            stok: $('#stok').val(),
            jml_jual: $('#jml_jual').val(),
            tgl_transaksi: $('#tgl_transaksi').val(),
            jenis_barang: $('#jenis_barang').val()
        };
        const isUpdate = formData.id ? true : false;
        addData(formData, isUpdate); // Send formData as a JSON object
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
            id: $(this).data('id'),
            nama_barang: $('#nama_barang').val(),
            stok: $('#stok').val(),
            jml_jual: $('#jml_jual').val(),
            tgl_transaksi: $('#tgl_transaksi').val(),
            jenis_barang: $('#jenis_barang').val()
        };
        const isUpdate = formData.id ? true : false;
        addData(formData, isUpdate);
    });
});
