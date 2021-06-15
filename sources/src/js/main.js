$(function () {
    $('.menu-toggle').on('click', function () {
        $('.menu-list').slideToggle(350)
        $(this).toggleClass('active')
    })

    $('.reviews-section__slider').slick({
        slidesToShow: 3,
        slidesToScroll: 3,
        nextArrow: $('.reviews-section__arrow-next'),
        prevArrow: $('.reviews-section__arrow-prev'),
        responsive: [
            {
                breakpoint: 1023,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }]
    })

    $('.popup-open').on('click', function (){
        $('#popup').addClass('active')
        console.log('sdfg')
    })
    $('.popup-close').on('click', function (){
        $('#popup').removeClass('active')
    })


    $('.questions-section__item-header').eq(0).addClass('active')
    $('.questions-section__item-body').eq(0).slideDown(200)

    $('.questions-section__item-header').on('click', function () {
        if(!$(this).hasClass('active') === true){
            $('.questions-section__item-header').removeClass('active')
            $('.questions-section__item-body').slideUp(200)

            $(this).toggleClass('active')
            $(this).next().slideToggle(200)
        }else{
            $(this).toggleClass('active')
            $(this).next().slideToggle(200)
        }
    })

    $('.js-mask').mask("+7 (999) 999-99-99");

    $('[data-href]').on('click', function (event){
        event.preventDefault()
        var getLink = $(this).attr("data-href");
        var positionElemY = $(getLink)[0].offsetTop;
        $('html').animate({scrollTop: positionElemY - 150}, 1100);
    })
})


// забираем utm из адресной строки и пишем в sessionStorage, чтобы отправить их на сервер при form submit
var utms = parseGET();
// проверяем есть ли utm в адресной строке, если есть то пишем в sessionStorage
if (utms && Object.keys(utms).length > 0) {
    window.sessionStorage.setItem('utms', JSON.stringify(utms));
} else {
    // если нет то берем utm из sessionStorage
    utms = JSON.parse(window.sessionStorage.getItem('utms') || "[]");
}


// забирает utm тэги из адресной строки
function parseGET(url) {
    var namekey = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

    if (!url || url == '') url = decodeURI(document.location.search);

    if (url.indexOf('?') < 0) return Array();
    url = url.split('?');
    url = url[1];
    var GET = {}, params = [], key = [];

    if (url.indexOf('#') != -1) {
        url = url.substr(0, url.indexOf('#'));
    }

    if (url.indexOf('&') > -1) {
        params = url.split('&');
    } else {
        params[0] = url;
    }

    for (var r = 0; r < params.length; r++) {
        for (var z = 0; z < namekey.length; z++) {
            if (params[r].indexOf(namekey[z] + '=') > -1) {
                if (params[r].indexOf('=') > -1) {
                    key = params[r].split('=');
                    GET[key[0]] = key[1];
                }
            }
        }
    }

    return (GET);
};

// Отправка формы
$(".ajax-submit").click(function (e) {
    var $form = $(this).closest('form');
    var $requireds = $form.find(':required');
    var formValid = true;

// проверяем объязательные (required) поля этой формы
    $requireds.each(function () {
        $elem = $(this);

// если поле пусто, то ему добавляем класс error
        if (!$elem.val() || !checkInput($elem)) {
            $elem.addClass('error');
            formValid = false;
        }
    });

    if (formValid) {
        // создаем скрытые поля для utm внутрии формы
        if (Object.keys(utms).length === 0) {
            utms['utm_source'] = "https://deluxeservice.kz/";
        }

        console.log(utms)

        // СЃРѕР·РґР°РµРј СЃРєСЂС‹С‚С‹Рµ РїРѕР»СЏ РґР»СЏ utm РІРЅСѓС‚СЂРёРё С„РѕСЂРјС‹
        for (var key in utms) {
            var input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = utms[key];
            $form[0].appendChild(input);
            console.log(utms)
        }
    } else {
        e.preventDefault();
    }
});

$(".form-submit").on("submit", function (event) {
    event.preventDefault();

    const form = new FormData($(this)[0]);

    var valid = true;

    var noChars = ["!", "@", "№", "$", ";", "%", "^", ":", "&", "?", "*", "(", ")",
        "_", "-", "+", "=", "<", ">", "'", ",", "/", "|", "]", "[", "{", "}", "`", "~", "'",
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "#"];

    for (var [name, val] of form) {
        console.log(name + " - " + val)
    }

    console.log(form.has("tel"))

    if (form.has("tel")) {
        var str = form.get("tel")
        str = str.split("-").join("");
        str = str.split("(").join("");
        str = str.split(")").join("");
        str = str.split("+").join("");
        str = str.split(" ").join("");

        if (str.length != 11) {
            $(this).find("input[name='tel']").removeClass("yes-valid")
            $(this).find("input[name='tel']").addClass("no-valid");
            valid = false;
        } else {
            $(this).find("input[name='tel']").removeClass("no-valid")
            $(this).find("input[name='tel']").addClass("yes-valid");
        }

    }

    if (form.has("name")) {

        if (!form.get("name")) {
            $(this).find("input[name='name']").addClass("yes-valid");
            return true;
        }

        var str = form.get("name").split("");
        console.log(str)
        console.log(noChars)
        for (var i = 0; i < str.length; i++) {
            for (var i1 = 0; i1 < noChars.length; i1++) {
                if (str[i] === noChars[i1]) {
                    $(this).find("input[name='name']").removeClass("yes-valid");
                    $(this).find("input[name='name']").addClass("no-valid");
                    valid = false;
                    return false
                } else {
                    console.log("sdfsdf")
                    $(this).find("input[name='name']").removeClass("no-valid");
                    $(this).find("input[name='name']").addClass("yes-valid");
                }
            }
        }
    }

    console.log(valid)

    if (valid){
        var outUtms = '';
        for(var key in utms){
            outUtms += (key + " - " + utms[key] +  "\n");
        }
        form.append("utms", outUtms);

        const xml = new XMLHttpRequest();
        xml.open("POST", "../php/form.php");
        xml.send(form);

        xml.onload = () => {
            if (xml.status != 200){
                console.log("Не хорошо")
                console.log(xml.response)
            }else{
                window.open("thanks.html", false)
                console.log("Все хорошо")
                $(this).find("input[type='text']").val("")
            }
        }

    }
});

$("input.input-text").on("click", function () {
    $(this).removeClass("no-valid")
    $(this).removeClass("yes-valid")
})


setTimeout(function(){
    var elem = document.createElement('script');
    elem.type = 'text/javascript';
    elem.src = '//api-maps.yandex.ru/2.1/?load=package.standard&lang=ru-RU&onload=getYaMap';
    document.getElementsByTagName('body')[0].appendChild(elem);
}, 2000);

function getYaMap(){
    var myMap = new ymaps.Map("map",{center: [43.241885, 76.877508],zoom: 15});
    myGeoObject = new ymaps.GeoObject({
        geometry: {
            type: "Point",
            coordinates: [43.241885, 76.877508]
        },
    }, {
        preset: 'islands#blackStretchyIcon',

        draggable: true
    })
    myMap.geoObjects
        .add(myGeoObject)
        .add(new ymaps.Placemark([43.241885, 76.877508], {
            iconCaption: 'Delux - сервис центр',
        }, {
            preset: 'islands#greenDotIconWithCaption',
            iconColor: '#84aaff'
        }))
}

/*
    jQuery Masked Input Plugin
    Copyright (c) 2007 - 2015 Josh Bush (digitalbush.com)
    Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
    Version: 1.4.1
*/
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):jQuery)}(function(a){var b,c=navigator.userAgent,d=/iphone/i.test(c),e=/chrome/i.test(c),f=/android/i.test(c);a.mask={definitions:{9:"[0-9]",a:"[A-Za-z]","*":"[A-Za-z0-9]"},autoclear:!0,dataName:"rawMaskFn",placeholder:"_"},a.fn.extend({caret:function(a,b){var c;if(0!==this.length&&!this.is(":hidden"))return"number"==typeof a?(b="number"==typeof b?b:a,this.each(function(){this.setSelectionRange?this.setSelectionRange(a,b):this.createTextRange&&(c=this.createTextRange(),c.collapse(!0),c.moveEnd("character",b),c.moveStart("character",a),c.select())})):(this[0].setSelectionRange?(a=this[0].selectionStart,b=this[0].selectionEnd):document.selection&&document.selection.createRange&&(c=document.selection.createRange(),a=0-c.duplicate().moveStart("character",-1e5),b=a+c.text.length),{begin:a,end:b})},unmask:function(){return this.trigger("unmask")},mask:function(c,g){var h,i,j,k,l,m,n,o;if(!c&&this.length>0){h=a(this[0]);var p=h.data(a.mask.dataName);return p?p():void 0}return g=a.extend({autoclear:a.mask.autoclear,placeholder:a.mask.placeholder,completed:null},g),i=a.mask.definitions,j=[],k=n=c.length,l=null,a.each(c.split(""),function(a,b){"?"==b?(n--,k=a):i[b]?(j.push(new RegExp(i[b])),null===l&&(l=j.length-1),k>a&&(m=j.length-1)):j.push(null)}),this.trigger("unmask").each(function(){function h(){if(g.completed){for(var a=l;m>=a;a++)if(j[a]&&C[a]===p(a))return;g.completed.call(B)}}function p(a){return g.placeholder.charAt(a<g.placeholder.length?a:0)}function q(a){for(;++a<n&&!j[a];);return a}function r(a){for(;--a>=0&&!j[a];);return a}function s(a,b){var c,d;if(!(0>a)){for(c=a,d=q(b);n>c;c++)if(j[c]){if(!(n>d&&j[c].test(C[d])))break;C[c]=C[d],C[d]=p(d),d=q(d)}z(),B.caret(Math.max(l,a))}}function t(a){var b,c,d,e;for(b=a,c=p(a);n>b;b++)if(j[b]){if(d=q(b),e=C[b],C[b]=c,!(n>d&&j[d].test(e)))break;c=e}}function u(){var a=B.val(),b=B.caret();if(o&&o.length&&o.length>a.length){for(A(!0);b.begin>0&&!j[b.begin-1];)b.begin--;if(0===b.begin)for(;b.begin<l&&!j[b.begin];)b.begin++;B.caret(b.begin,b.begin)}else{for(A(!0);b.begin<n&&!j[b.begin];)b.begin++;B.caret(b.begin,b.begin)}h()}function v(){A(),B.val()!=E&&B.change()}function w(a){if(!B.prop("readonly")){var b,c,e,f=a.which||a.keyCode;o=B.val(),8===f||46===f||d&&127===f?(b=B.caret(),c=b.begin,e=b.end,e-c===0&&(c=46!==f?r(c):e=q(c-1),e=46===f?q(e):e),y(c,e),s(c,e-1),a.preventDefault()):13===f?v.call(this,a):27===f&&(B.val(E),B.caret(0,A()),a.preventDefault())}}function x(b){if(!B.prop("readonly")){var c,d,e,g=b.which||b.keyCode,i=B.caret();if(!(b.ctrlKey||b.altKey||b.metaKey||32>g)&&g&&13!==g){if(i.end-i.begin!==0&&(y(i.begin,i.end),s(i.begin,i.end-1)),c=q(i.begin-1),n>c&&(d=String.fromCharCode(g),j[c].test(d))){if(t(c),C[c]=d,z(),e=q(c),f){var k=function(){a.proxy(a.fn.caret,B,e)()};setTimeout(k,0)}else B.caret(e);i.begin<=m&&h()}b.preventDefault()}}}function y(a,b){var c;for(c=a;b>c&&n>c;c++)j[c]&&(C[c]=p(c))}function z(){B.val(C.join(""))}function A(a){var b,c,d,e=B.val(),f=-1;for(b=0,d=0;n>b;b++)if(j[b]){for(C[b]=p(b);d++<e.length;)if(c=e.charAt(d-1),j[b].test(c)){C[b]=c,f=b;break}if(d>e.length){y(b+1,n);break}}else C[b]===e.charAt(d)&&d++,k>b&&(f=b);return a?z():k>f+1?g.autoclear||C.join("")===D?(B.val()&&B.val(""),y(0,n)):z():(z(),B.val(B.val().substring(0,f+1))),k?b:l}var B=a(this),C=a.map(c.split(""),function(a,b){return"?"!=a?i[a]?p(b):a:void 0}),D=C.join(""),E=B.val();B.data(a.mask.dataName,function(){return a.map(C,function(a,b){return j[b]&&a!=p(b)?a:null}).join("")}),B.one("unmask",function(){B.off(".mask").removeData(a.mask.dataName)}).on("focus.mask",function(){if(!B.prop("readonly")){clearTimeout(b);var a;E=B.val(),a=A(),b=setTimeout(function(){B.get(0)===document.activeElement&&(z(),a==c.replace("?","").length?B.caret(0,a):B.caret(a))},10)}}).on("blur.mask",v).on("keydown.mask",w).on("keypress.mask",x).on("input.mask paste.mask",function(){B.prop("readonly")||setTimeout(function(){var a=A(!0);B.caret(a),h()},0)}),e&&f&&B.off("input.mask").on("input.mask",u),A()})}})});