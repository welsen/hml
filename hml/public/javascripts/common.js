function AsyncRPC(url, data, callback) {
    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        dataType: 'json',
        headers: {
            'cache-control': 'no-cache'
        },
        success: callback,
        error: callback
    });

}

function SyncRPC(url, data) {
    var result = null;
    $.ajax({
        url: url,
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        dataType: 'json',
        headers: {
            'cache-control': 'no-cache'
        },
        success: function (data) {
            result = data;
        },
        error: function (data) {
            result = data;
        }
    });
    return result;
}

function TypeData(data) {
    if (data.hasOwnProperty('__type')) {
        return (new Function('return new ' + data.__type + '(' + JSON.stringify(data) + ');'))();
    }
    return data;
}


(function($) {
    $.fn.serializeJSON = function() {
        var json = {};
        $.map($(this).serializeArray(), function(n, i) {
            json[n['name']] = n['value'];
        });
        return json;
    };
})(jQuery);
