/*--------------------------詢問車--------------------------*/
function inquiryCartList(inquiryCart)
{
    var appendHtml = '';
    var inventory = 0;
    $.each(inquiryCart, function (k, v) {
        inventory += parseInt(v['qty']);
        appendHtml += '<div class="row">\n' +
            '<div class="col-md-3"><a href="' + v['options']['url'] + '" title="' + v['name'] + '"><img src="' + v['options']['image'] + '" alt="' + v['name'] + '" width="65px" height="auto" title="' + v['name'] + '"/></a></div>'+
            '<div class="col-md-9"><a href="' + v['options']['url'] + '" title="' + v['name'] + '">' + v['name'] + '</a><div><span>X ' + v['qty'] + '</span><span class="del_0"><a class="product-remove" href="javascript:void(0);" data-title="' + v['rowId'] + '"><img src="/asset/images/delete.svg" alt=""/></a></span></div></div>'+
            '</div>';
    });

    $('#inquirycart-menu-list').html(appendHtml);
    $('#inquirycart-inventory').html('(' + inventory + ')');
}

/*--------------------------隱私權--------------------------*/
$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $("meta[name='csrf-token']").attr('content')
        }
    });

    $('.addInquiryCart').click(function () {
        var url = $("#cartUrl").val();
        var id = $("input[name='id']").val();
        var name = $("input[name='name']").val();
        $.ajax({
            type: 'POST',
            url: url + '/inquirycart/add',
            data: {'mode': 'add', 'id': id, 'name': name},
            // dataType: "json",
            success: function (result) {
                eval(result);
                // if (result['success']) swal.fire(result['success'], '', 'success');
                // if (result['error']) swal.fire(result['error'], '', 'error');
                // inquiryCartList(result['cart']);
            }
        });
    });

    $(document).on('change', '.checkout_qty', function () {
        var qty = $(this).val();
        var rowId = $(this).attr('data-title');
        var url = $("#cartUrl").val();
        $.ajax({
            type: 'POST',
            url: url + '/inquirycart/update',
            data: {'mode': 'update', 'rowId': rowId, 'qty': qty},
            dataType: "json",
            success: function (result) {
                // inquiryCartList(result['cart']);
                if (result['error']) swal.fire(result['error'], '', 'error');
            }
        });
    });
    $(".qtychange").click(function(e) {
        e.preventDefault();
        var obj = $(this).parent().find("input.qty");
        if($(this).val().toString() == "+") {
            obj.val(parseInt(obj.val())+1);
        } else {
            if(obj.val()>1)
                obj.val(parseInt(obj.val())-1);
        }
    });

    $(document).on('click', '.product-remove', function () {
        var rowId = $(this).attr('data-title');
        var url = $("#cartUrl").val();
        $.ajax({
            type: 'POST',
            url: url + '/inquirycart/remove',
            data: {'mode': 'remove', 'rowId': rowId},
            dataType: "json",
            success: function (result) {
                $('#' + result['rowId']).remove();

                if($("div.inquirycart div.row").length<2)
                    location.reload();
                else
                    inquiryCartList(result['cart']);
            }
        });
    });

});
