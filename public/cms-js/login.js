var cms_key = null;
function GetKeyCMS() {
    $.ajax({
        type: 'POST',
        data: '',
        contentType: 'application/json',
        url: '/cms/getkeyCMS',
        success: function (data) {
            cms_key = data;
        }
    });
}
GetKeyCMS();
function Login() {
    if (cms_key == null) {
        GetKeyCMS();
        return;
    }
    var txtUsername = document.getElementById("txtUsername");
    var txtPassword = document.getElementById("txtPassword");
    if (txtUsername.value === null || txtUsername.value === undefined || txtUsername.value === "") { alert("Vui lòng nhập Tài khoản"); return; }
    if (txtPassword.value === null || txtPassword.value === undefined || txtPassword.value === "") { alert("Vui lòng nhập mật khẩu"); return; }
    var objUser = {};
    objUser.UserName = txtUsername.value;
    objUser.Password = txtPassword.value;
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(objUser), cms_key).toString();
    var dataEncrypt = { data: ciphertext };
    $.ajax({
        type: 'POST',
        data: JSON.stringify(dataEncrypt),
        contentType: 'application/json',
        url: '/cms/loginCMS',
        success: function (data) {
            if (data.success == "true") {
                window.location.href = '/cms/member';
            }
            else {
				GetKeyCMS();
                alert(data.message);
            }
        }
    });
}

function runScript(e) {
    //See notes about 'which' and 'key'
    if (e.keyCode == 13) {
        Login();
    }
}
