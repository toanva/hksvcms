
var datatable = $('#grvResult').DataTable({
    scrollY: 400,
    scrollX: true,
    scrollCollapse: true,
    select: true,
    dom: 'Bfrtip',
    buttons: [
        {
            extend: 'excelHtml5',
        },
        {
            extend: 'pdfHtml5',
        }
    ],
    ajax: {
        dataType: "json",
        url: "/cms/getRedeemGifts",
        data: function (d) {
            var name = "";
            var status = "";
            var value = "";
            if ($('#txtName').val() != "" && $('#txtName').val() != undefined) name = $("#txtName").val();
            if (document.getElementById("cboStatus").selectedIndex != 0) status = document.getElementById("cboStatus").value;
            if ($('#txtValue').val() != "" && $('#txtValue').val() != undefined) value = $("#txtValue").val();
            
            d.name = name;
            d.status = status;
            d.value = value;
    
            d.psid = "";
        },
        error: function (err) {
            if (err.responseText == 'Unauthorized') {
                alert("Bạn đã bị time out");
                window.location.href = '/cms';
            }
        },
        dataSrc: ""
    },
    columnDefs: [
        {
            targets: [5],
            visible: false
        }
    ],
    columns: [
        { data: 'GiftCode', defaultContent: "" },
        { data: 'Name', defaultContent: "" },
        { data: 'PointValue', defaultContent: "" },
        { data: 'Value', defaultContent: "" },
        {
            data: 'Status', render: function (data, type, row, meta) {
                return data === "ACTIVE" ? "Đã duyệt" : "Chưa duyệt";
            }
        },
        {
            data: 'InsertDate', render: function (data, type, row, meta) {
                return formatDateDetail1(data);
            }
        },
        {
            data: 'InsertDate', render: function (data, type, row, meta) {
                return GetBirthDay(data);
            }
        },
        {
            data: 'Status', render: function (data, type, row, meta) {
                if (row.Status == "PENDING") {
                    var button = '<button type="button" class="btn btn-primary btn-sm" onclick="Accept(' + row.GiftCode + ')">Duyệt</button>';
                    return button;
                }
                else return "";
            }
        }
    ]
});

function SearchMember() {
    datatable.ajax.reload();
    datatable.draw();
};

function Accept(giftcode) {
    var data_query = {};
    data_query.GiftCode = giftcode;
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: "/cms/updateStatusGift",
        data: JSON.stringify(data_query),
        success: function (data) {
            if (data.success == "true") {
                alert("Duyệt thành công");
                SearchMember();
            }
            else {
                alert(data.message);
            }
        }
    });
};

