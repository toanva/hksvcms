//https://nongsanvn.herokuapp.com/getMember
var datatable = $('#grvResult').DataTable({
    scrollY: 400,
    scrollX: true,
    scrollCollapse: true,
    select: true,
    dom: 'Bfrtip',
    buttons: [
        {
            extend: 'excelHtml5',
            exportOptions: {
                columns: [3, ':visible']
            }
        },
        {
            extend: 'pdfHtml5',
            exportOptions: {
                columns: [0, 1, 2]
            }
        }
    ],
    ajax: {
        dataType: "json",
        url: "/getUser",
        data: function (d) {
            var username = "";
            var fullname = "";
            var status = "";
            if ($('#txtUserNameSearch').val() != "" && $('#txtUserNameSearch').val() != undefined) username = $("#txtUserNameSearch").val();
            if ($('#txtFullNameSearch').val() != "" && $('#txtFullNameSearch').val() != undefined) fullname = $("#txtFullNameSearch").val();
            if (document.getElementById("cboStatus").selectedIndex != 0) status = document.getElementById("cboStatus").value;
            d.username = username;
            d.fullname = fullname;
            d.status = status;
        },
        dataSrc: ""
    },
    columns: [
        { data: 'UserName', defaultContent: "" },
        { data: 'FullName', defaultContent: "" },
        { data: 'Status', defaultContent: "" },
        {
            data: null,
            render: function CreateActionEdit() {
                var img = '<div class="btn-group" role="group"><button type="button" class="btn btn-default btn-sm edit" title="Sửa thông tin"><img src="assets/img/sf/notepad.svg" height="16" width="16">' +
                    '</button><button type="button" title="Đổi mật khẩu" class="btn btn-default btn-sm reset"><img src="assets/img/sf/key.svg" height="16" width="16"></button>' +
                    '</button><button type="button" title="Xóa tài khoản" class="btn btn-default btn-sm delete"><img src="assets/img/sf/sign-delete.svg" height="16" width="16"></button></div >'
                return img;
            }
        }
    ]
}); 

$('#grvResult tbody').on('click', '.edit', function () {
    var data_row = datatable.row($(this).closest('tr')).data();
    $('#btnEditUser').show();
    $('#btnInsertUser').hide();
    $('#btnResetUser').hide();
    $('#divFullName').show();
    $('#divStatus').show();
    $('#divPassword').hide();

    $('#txtUserName').val(data_row.UserName);
    $('#txtFullName').val(data_row.FullName);
    $('#cbStatus').val(data_row.Status);

    $('#txtPassword').val('');
    $("#txtUserName").attr('disabled', 'disabled');
    $('#myModalLabel').text('Sửa tài khoản');
    $('#myModal').modal('show');
});
$('#grvResult tbody').on('click', '.reset', function () {
    var data_row = datatable.row($(this).closest('tr')).data();
    $('#btnResetUser').show();
    $('#btnEditUser').hide();
    $('#btnInsertUser').hide();
    $('#divFullName').hide();
    $('#divStatus').hide();
    $('#divPassword').show();

    $('#txtUserName').val(data_row.UserName);
    $('#txtFullName').val(data_row.FullName);
    $('#cbStatus').val(data_row.Status);

    $('#txtPassword').val('');
    $("#txtUserName").attr('disabled', 'disabled');
    $('#myModalLabel').text('Sửa tài khoản');
    $('#myModal').modal('show');
});
$('#grvResult tbody').on('click', '.delete', function () {
    var data_row = datatable.row($(this).closest('tr')).data();
    $('#txtUserNameDelete').val(data_row.UserName);
    $('#deleteModal').modal('show');
});
function KeySearch(e) {
    if (e.keyCode == 13) {
        Search();
    }
};
function Search() {
    datatable.ajax.reload();
    datatable.draw();
};

function Add() {
    $('#divPassword').show();
    $('#divFullName').show();
    $('#divStatus').show();
    $('#btnInsertUser').show();
    $('#btnEditUser').hide();
    $('#btnResetUser').hide();
    $("#txtUserName").removeAttr('disabled');
    $('#txtUserName').val('');
    $('#txtFullName').val('');
    $('#txtPassword').val('');
    $('#cbStatus').val('Active');
    $('#myModalLabel').text('Thêm mới tài khoản');
    $('#myModal').modal('show');
}

function GetBirthDay(data) {
    var date = new Date(data);
    var birthday = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    return birthday;
}
function GetImage(data_url) {
    var img = '<img style="max-width: 80px;min-width: 70px;"  src="' + data_url + '">'
    return img;
}
function GetAction(data) {
    var img = '<img style="max-width: 80px;min-width: 70px;"  src="' + data_url + '" onclick="AccpetMember(this);return false;">'
    return img;
}

//Search();

function SaveUser(isEdit) {
    var UserName = "";
    var Password = "";
    var Status = "";
    var FullName = "";
    Status = $('#cbStatus').val();
    if ($('#txtUserName').val() == "" || $('#txtUserName').val() == undefined) return alert("Bạn cần nhập Tài khoản");
    if (isEdit != 2 && ($('#txtFullName').val() == "" || $('#txtFullName').val() == undefined)) return alert("Bạn cần nhập Họ và tên");
    if (isEdit != 1 && ($('#txtPassword').val() == "" || $('#txtPassword').val() == undefined)) return alert("Bạn cần nhập Mật khẩu");
    UserName = $("#txtUserName").val();
    Password = $("#txtPassword").val();
    FullName = $("#txtFullName").val();
    var objUser = {
        isEdit: isEdit,
        Status: Status,
        UserName: UserName,
        FullName: FullName,
        Password: Password,
        Status: Status
    }

    $.ajax({
        contentType: 'application/json',
        url: "/insertUser",
        type: "POST",
        data: JSON.stringify(objUser),
        success: function (result) {
            if (isEdit == 0) {
                if (result.success == "true") {
                    $('#myModal').modal('hide');
                    Search();
                } else if (result.success == "false" && result.message == "ERROR_EXIST") {
                    alert("Tài khoản đã tồn tại");
                }
            }
            else {
                if (result.success == "true") {
                    $('#myModal').modal('hide');
                    Search();
                } else if (result.success == "false") {
                    alert(result.message);
                }
            }
        },
        error: function (result) {
            alert("Lỗi:" + result.responseText);
        }
    });
}

function Delete() {
    var UserName = $("#txtUserNameDelete").val();
    var objUser = { UserName: UserName };
    if (UserName.length > 0) {
        $.ajax({
            contentType: 'application/json',
            url: "/deleteUser",
            type: "POST",
            data: JSON.stringify(objUser),
            success: function (result) {
                if (result.success == "true") {
                    $('#deleteModal').modal('hide');
                    Search();
                } else if (result.success == "false") {
                    alert("Lỗi:" + result.message);
                }
            },
            error: function (result) {
                alert("Lỗi:" + result.responseText);
            }
        });
    }
}