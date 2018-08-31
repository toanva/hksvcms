function Logout() {
    $.ajax({
        type: 'GET',
        data: '',
        contentType: 'application/json',
        url: '/cms/logoutCMS',
        success: function (data) {
            alert('Đăng xuất thành công');
			window.location.href = '/cms';
        }
    });
}

