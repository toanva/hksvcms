
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
        url: "/cms/getMemberCMS",
        data: function (d) {
            var name = "";
            var provincial = "";
            var districts = "";
            var wards = "";
            var blockstatus = "";
            var position = "";
            var layer = "";
            var level = "";
            if ($('#txtName').val() != "" && $('#txtName').val() != undefined)
                name = $("#txtName").val();
            //if (cboStatus.selectedIndex != 0)
            //    blockstatus = cboStatus.value;
            d.phone = "";//$("#txtPhone").val();
            d.name = name;
            d.position = position;
            d.blockstatus = blockstatus;
            d.provincial = provincial;
            d.districts = districts;
            d.wards = wards;
            d.level = level;
            d.layer = "";
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
    columns: [
        { data: 'Name', defaultContent: "" },
        { data: 'CandidatesCode', defaultContent: "" },
        {
            data: 'Url1', render: function (data, type, row, meta) {
                return data !== undefined ? '<img class="img-responsive center-block img-rounded" alt="Responsive image" src="' + data + '" height="200" width="200">' : '';
            }
        },
        {
            data: 'Url2', render: function (data, type, row, meta) {
                return data !== undefined ? '<img class="img-responsive center-block img-rounded" alt="Responsive image" src="' + data + '" height="200"  width="200">' : '';
            }
        },
        //{
        //    data: 'Name', render: function (data, type, row, meta) {
        //        return '<a href="#" onclick="ShowDetail(' + row._id + ')">' + data + '</a>';
        //    }
        //},
        {
            data: 'InsertDate', render: function (data, type, row, meta) {
                return GetBirthDay(data);
            }
        }
        //,
        //{ data: 'Name', defaultContent: "" },
        //{ data: 'Provincial', defaultContent: "" },
        //{ data: 'District', defaultContent: "" },
        //{ data: 'Ward', defaultContent: "" },
        //{ data: 'Phone', defaultContent: "" },
        //{ data: 'Email', defaultContent: "" },
        //{
        //    data: 'BlockStatus', render: function (data, type, row, meta) {
        //        return data === "ACTIVE" ? "Đã duyệt" : "Chưa duyệt";
        //    }
        //}
    ]
});

function SearchMember() {
    datatable.ajax.reload();
    datatable.draw();
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
        if (obj.BlockStatus == 'PENDING') {
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


