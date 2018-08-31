
//Partern Code/ID
function isValidCode(obj) {
    var strString = obj.value;
    var index = strString.length;
    if (/^[a-zA-Z0-9]*$/.test(strString) == false) {
        obj.value = strString.substring(0, index - 1);
    }
}
//Partern Name
function isValidName(obj) {
    var strString = obj.value;
    var index = strString.length;
    if (/^[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹa-zA-Z0-9\s]*$/.test(strString) == false) {
        obj.value = strString.substring(0, index - 1);
    }
}
function valInteger(obj) {
    var i, strVal, blnChange;
    blnChange = false
    strVal = "";

    for (i = 0; i < (obj.value).length; i++) {
        switch (obj.value.charAt(i)) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9": strVal = strVal + obj.value.charAt(i);
                break;
            default: blnChange = true;
                break;
        }
    }
    if (blnChange) {
        obj.value = strVal;
    }
}

function valMoneyNumber(obj) {
    if (obj.length == 0) return;
    var a = parseFloat(obj.replace(/,/g, ""))
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return a;
}

function FormatNumber(str) {
    if (str == undefined) return 0;
    var strTemp = GetNumber(str);
    if (strTemp.length <= 3)
        return strTemp;
    strResult = "";
    for (var i = 0; i < strTemp.length; i++)
        strTemp = strTemp.replace(",", "");
    var m = strTemp.lastIndexOf(".");
    if (m == -1) {
        for (var i = strTemp.length; i >= 0; i--) {
            if (strResult.length > 0 && (strTemp.length - i - 1) % 3 == 0)
                strResult = "," + strResult;
            strResult = strTemp.substring(i, i + 1) + strResult;
        }
    } else {
        var strphannguyen = strTemp.substring(0, strTemp.lastIndexOf("."));
        var strphanthapphan = strTemp.substring(strTemp.lastIndexOf("."),
            strTemp.length);
        var tam = 0;
        for (var i = strphannguyen.length; i >= 0; i--) {

            if (strResult.length > 0 && tam == 4) {
                strResult = "," + strResult;
                tam = 1;
            }

            strResult = strphannguyen.substring(i, i + 1) + strResult;
            tam = tam + 1;
        }
        strResult = strResult + strphanthapphan;
    }
    return strResult;
}

function GetNumber(str) {
    var count = 0;
    for (var i = 0; i < str.length; i++) {
        var temp = str.substring(i, i + 1);
        if (!(temp == "," || temp == "." || (temp >= 0 && temp <= 9))) {
            return str.substring(0, i);
        }
        if (temp == " ")
            return str.substring(0, i);
        if (temp == ".") {
            if (count > 0)
                return str.substring(0, i);
            count++;
        }
    }
    return str;
}

function IsNumberInt(str) {
    for (var i = 0; i < str.length; i++) {
        var temp = str.substring(i, i + 1);
        if (!(temp == "." || (temp >= 0 && temp <= 9))) {
            return str.substring(0, i);
        }
        if (temp == ",") {
            return str.substring(0, i);
        }
    }
    return str;
}

String.prototype.replaceAll = function (strTarget, strSubString) {
    var strText = this;
    var intIndexOfMatch = strText.indexOf(strTarget);
    while (intIndexOfMatch != -1) {
        strText = strText.replace(strTarget, strSubString)
        intIndexOfMatch = strText.indexOf(strTarget);
    }
    return (strText);
} 

function formatDate(date) {
    try {
        if (date == null || date.length == 0) return '';
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('/');
    } catch (e) {
        return '';
    }
    
}

function formatDateDetail(date) {
    try {
        if (date == null || date.length == 0) return '';
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hour = '' + d.getHours(),
            minutes = '' + d.getMinutes(),
            seconds = '' + d.getSeconds();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        if (hour.length < 2) hour = '0' + hour;
        if (minutes.length < 2) minutes = '0' + minutes;
        if (seconds.length < 2) seconds = '0' + seconds;

        return [[day, month, year].join('/'), [hour, minutes, seconds].join(':')].join(' ');
    } catch (e) {
        return '';
    }
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