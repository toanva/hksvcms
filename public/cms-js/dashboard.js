google.charts.setOnLoadCallback(onInit);
var piechartBlockStatus;
var piechartGeoCode;
var piechartPosition;
var isComplate=true;
function onInit(){

 getData();
	
};

function getData(){
	if(isComplate)
	{
		isComplate=false;
		
		var objBlockStatus;		
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
    var len = objBlockStatus.length;
    for (var i = 0; i < len; ++i) {
        dataProduct.addRow([objBlockStatus[i].Date, objBlockStatus[i].Total]);
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
	
isComplate=true;	
};


