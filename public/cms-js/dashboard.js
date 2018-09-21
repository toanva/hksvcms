google.charts.setOnLoadCallback(onInit);
var piechartBlockStatus;
var piechartGeoCode;
var piechartPosition;
var isComplate=true;
var isComplate1=true;
var isComplate2=true;
function onInit(){

 getData();
	
};

function getData(){
	if(isComplate)
	{
		isComplate=false;
		isComplate1=false;
		isComplate2=false;
		
		var objBlockStatus;
		var objBlockStatusUser;
		$.ajax({
		dataType: "json",
		url: "/cms/getUserByGroup?code=day",
		data: objBlockStatusUser,
		success: function(data) {
				objBlockStatusUser =	data;
				drawBlockStatusUser(objBlockStatusUser);
			 },
		  	error: function(err) {
                    if (err.responseText == 'Unauthorized') {
                        {
                            alert("Bạn đã bị time out");
                            window.location.href = '/cms';
                        }
                    }
			}            
		});
		$.ajax({
		dataType: "json",
		url: "/cms/getMemberByGroup?code=day",
		data: objBlockStatus,
		success: function(data) {
				objBlockStatus=	data;
				drawBlockStatus(objBlockStatus);
			 },
		  	error: function(err) {
                    if (err.responseText == 'Unauthorized') {
                        {
                            alert("Bạn đã bị time out");
                            window.location.href = '/cms';
                        }
                    }
			}            
		});
		
	}else
	{
	  /////setTimeout(getGeoProvincial,5000);
	}
};

function drawBlockStatus(objBlockStatus) {
	
    var dataProduct = new google.visualization.DataTable();
    dataProduct.addColumn('string', 'Ngày');
    dataProduct.addColumn('number', 'Số lượng');
    dataProduct.addColumn('number', 'Tổng');
    var len = objBlockStatus.length;
    var total_current = 0;
    for (var i = 0; i < len; ++i) {
        total_current = total_current + objBlockStatus[i].Total;
        dataProduct.addRow([objBlockStatus[i].Date, objBlockStatus[i].Total, total_current]);
    }
    var options = {
        chart: {
            title: 'Thống kê',
            subtitle: 'Ngày, Số lượng thí sinh đăng ký mới',
        },
        dataOpacity: 5
        //bars: 'horizontal' // Required for Material Bar Charts.,
        
    };

    var chart = new google.charts.Bar(document.getElementById('dvBlockStatus'));

    chart.draw(dataProduct, google.charts.Bar.convertOptions(options));
    	
isComplate1=true;
if (isComplate2) isComplate=true;
	
};

function drawBlockStatusUser(objBlockStatus) {
	
    var dataProduct = new google.visualization.DataTable();
    dataProduct.addColumn('string', 'Ngày');
    dataProduct.addColumn('number', 'Số lượng');
    dataProduct.addColumn('number', 'Tổng');
    var len = objBlockStatus.length;
    var total_current = 0;
    for (var i = 0; i < len; ++i) {
        total_current = total_current + objBlockStatus[i].Total;
        dataProduct.addRow([objBlockStatus[i].Date, objBlockStatus[i].Total, total_current]);
    }
    var options = {
        chart: {
            title: 'Thống kê',
            subtitle: 'Ngày, Số lượng người dùng mới',
        },
        dataOpacity: 5
        //bars: 'horizontal' // Required for Material Bar Charts.,
        
    };

    var chart = new google.charts.Bar(document.getElementById('dvBlockStatusUser'));

    chart.draw(dataProduct, google.charts.Bar.convertOptions(options));
	
isComplate2=true;
	if (isComplate1) isComplate=true;
};


