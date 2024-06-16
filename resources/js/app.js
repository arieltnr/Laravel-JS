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

function parseDate(dateStr) {
    var parts = dateStr.split('-');
    return new Date(parts[2], parts[1] - 1, parts[0]); // Convert to Date object
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
    var tableBody = $('#barangTable').DataTable();
    tableBody.clear().draw(); // Clear existing data

    barangs.forEach(function (item, idx) {
        let no = idx + 1;
        let tgltransaksi = dateTime(item.tgl_transaksi);

        tableBody.row.add([
            no,
            item.nama_barang,
            item.stok,
            item.jml_jual,
            tgltransaksi,
            item.jenis_barang,
            `<button class="btn btn-danger deleteBtn" data-id="${item.id}">Hapus</button>
             <button class="btn btn-primary editBtn" data-id="${item.id}">Edit</button>`
        ]).draw(false);
    });

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

    var table = $('#barangTable').DataTable();

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

    // Custom filtering function which will search data in the "Tanggal Transaksi" column
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            var minDateStr = $('#minDate').val();
            var maxDateStr = $('#maxDate').val();
            var transactionDateStr = data[4]; // Assuming the "Tanggal Transaksi" column is at index 4

            if (minDateStr && maxDateStr) {
                var minDate = new Date(minDateStr);
                var maxDate = new Date(maxDateStr);
                var transactionDate = parseDate(transactionDateStr);

                return transactionDate >= minDate && transactionDate <= maxDate;
            } else if (minDateStr) {
                var minDate = new Date(minDateStr);
                var transactionDate = parseDate(transactionDateStr);

                return transactionDate >= minDate;
            } else if (maxDateStr) {
                var maxDate = new Date(maxDateStr);
                var transactionDate = parseDate(transactionDateStr);

                return transactionDate <= maxDate;
            }
            return true;
        }
    );

    $('#minDate, #maxDate').change(function () {
        table.draw();
    });
    
});
