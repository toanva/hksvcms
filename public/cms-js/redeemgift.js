
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
            var placeofcontest = "";
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
        }
    ]
});

function SearchMember() {
    datatable.ajax.reload();
    datatable.draw();
};

function SendMessage() {
    var data_query = {};
    var message= "";
    var name = "";
    var type = "";
    var phone = "";
    var schools = "";
    var placeofcontest = "";
    if ($('#txtName').val() != "" && $('#txtName').val() != undefined) name = $("#txtName").val();
    if (document.getElementById("cboType").selectedIndex != 0) type = document.getElementById("cboType").value;
    if ($('#txtPhone').val() != "" && $('#txtPhone').val() != undefined) phone = $("#txtPhone").val();
    if ($('#txtSchools').val() != "" && $('#txtSchools').val() != undefined) schools = $("#txtSchools").val();
    if ($('#txtPlaceOfContest').val() != "" && $('#txtPlaceOfContest').val() != undefined) placeofcontest = $("#txtPlaceOfContest").val();
    if ($('#txtMessage').val() != "" && $('#txtMessage').val() != undefined) message = $("#txtMessage").val();
    data_query.message = message;
    data_query.name = name;
    data_query.type = type;
    data_query.phone = phone;
    data_query.schools = schools;
    data_query.placeofcontest = placeofcontest;
    data_query.psid = "";
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: "/cms/sendMessageToMember",
        data: JSON.stringify(data_query),
        success: function (data) {
            if (data.success == "true") {
                alert("Gửi tin nhắn thành công");
            }
            else {
                alert(data.message);
            }
        }
    });
};

function ShowDetail(id) {
    tableInfoPending.clear();
    tableInfoPending.draw();
    $("#info_name").text('');
    $("#info_level").text('');
    $("#info_position").text('');
    $("#info_birthday").text('');
    $("#info_phone").text('');
    $("#info_email").text('');
    $("#info_address").text('');
    $("#info_status").text('');
    $('#info_img').attr('src', '../img/logo.jpg');
    var imgAvatar = document.getElementById("info_img");
    var objInfo;
    $.ajax({
        dataType: "json",
        url: "/cms/getMember?psid=" + id,
        data: objInfo,
        success: function (data) {
            objInfo = data[0];
            imgAvatar.src = objInfo.ImgUrl;
            var status = objInfo.BlockStatus === "ACTIVE" ? "Đã duyệt" : "Chưa duyệt";
            $("#info_name").text(objInfo.Name);
            $("#info_level").text(objInfo.LevelName);
            $("#info_position").text(objInfo.Position);
            $("#info_birthday").text(objInfo.Birthday);
            $("#info_phone").text(objInfo.Phone);
            $("#info_email").text(objInfo.Email);
            $("#info_address").text(objInfo.Ward + ' - ' + objInfo.District + ' - ' + objInfo.Provincial);
            $("#info_status").text(status);
        }
    });
    var objMembers;
    $.ajax({
        dataType: "json",
        url: "/cms/getListMemberKsv?psid=" + id,
        data: objMembers,
        success: function (data) {
            objMembers = data;
            if (data !== null) drawTable(data);
        }
    });
    $('#myModal').modal('show');
}
var tableInfoPending = $("#grvInfoPending").DataTable({
    scrollY: 300,
    scrollX: true,
    scrollCollapse: true
});
$('#myModal').on('shown.bs.tab', function (e) {
    $($.fn.dataTable.tables(true)).DataTable()
        .columns.adjust();
});
$('#myModal').on('shown.bs.modal', function (e) {
    $($.fn.dataTable.tables(true)).DataTable()
        .columns.adjust();
});
function drawTable(objMembers) {

    for (var i = 0; i < objMembers.length; i++) {
        obj = objMembers[i];
        if (obj.BlockStatus == 'PENDING' && obj.Type == 'Candidates') {
            var img = '<img id="img_infodetail" src="' + obj.ImgUrl + '" alt="Ảnh đại diện" class="img-responsive">';
            var strRow = '';
            strRow = strRow + '<div class="col-sm-12"><label class="col-sm-4 text-right margin0">Họ và Tên:</label><label class="margin0 col-sm-8"> ' + obj.Name + '</label></div>';
            strRow = strRow + '<div class="col-sm-12"><label class="col-sm-4 text-right margin0">Cấp cán bộ:</label><label class="margin0 col-sm-8"> ' + obj.LevelName + '</label></div>';
            strRow = strRow + '<div class="col-sm-12"><label class="col-sm-4 text-right margin0">Chức vụ:</label><label class="margin0 col-sm-8"> ' + obj.Position + '</label></div>';
            strRow = strRow + '<div class="col-sm-12"><label class="col-sm-4 text-right margin0">Ngày sinh:</label><label class="margin0 col-sm-8"> ' + obj.Birthday + '</label></div>';
            strRow = strRow + '<div class="col-sm-12"><label class="col-sm-4 text-right margin0">Điện thoại:</label><label class="margin0 col-sm-8"> ' + obj.Phone + '</label></div>';
            strRow = strRow + '<div class="col-sm-12"><label class="col-sm-4 text-right margin0">Email:</label><label class="margin0 col-sm-8"> ' + obj.Email + '</label></div>';
            strRow = strRow + '<div class="col-sm-12"><label class="col-sm-4 text-right margin0">Địa chỉ :</label><label class="margin0 col-sm-8"> ' + obj.Ward + ' - ' + obj.District + ' - ' + obj.Provincial + '</label></div>';
            strRow = strRow + '<div class="col-sm-12"><label class="col-sm-4 text-right margin0">Trạng thái :</label><label class="margin0 col-sm-8"> Chờ duyệt</label></div>';
            tableInfoPending.row.add([img, strRow]).draw(false);
        }
    }
    tableInfoPending.draw();

};


