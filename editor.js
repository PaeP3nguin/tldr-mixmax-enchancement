/* jshint browser:true, jquery:true */

// Restore existing data, if any.
try {
    var data = JSON.parse(getURLParamByName('data'));

    $('.js-url').text(data.url);
    setUrl();
} catch (e) { }

function getURLParamByName(t) {
    var e = RegExp("[?&]" + t + "=([^&]*)").exec(window.location.search); return e && decodeURIComponent(e[1].replace(/\+/g, " "));
}

$('.js-url').focus();

$(document).on('keydown', function (e) {
    // Key: escape
    if (e.keyCode === 27) cancel();
});

$('.js-url').on('paste', function () {
    // Let the paste go through.
    setTimeout(setUrl, 1);
});

$('.js-url').on('keydown', function (e) {
    // Key: enter
    if (e.keyCode === 13) {
        e.preventDefault();
        $('.js-url').blur();
        setUrl();
    }
});

var selectedUrl = null;
var summaryTitle = null;
var summaryText = null;

function setUrl() {
    selectedUrl = null;
    summaryTitle = null;
    summaryText = null;
    var url = $('.js-url').text().trim();
    if (!url) return;

    // Assume http prefix.
    if (!/^(https?:\/\/)/.test(url)) {
        url = 'http://' + url;
    }

    selectedUrl = url;

    $('.js-error').hide();
    $('#js-show-summary').hide();
    $('.js-loading').show();

    $('#js-show-summary #js-summary-text').remove();
    $('#js-show-summary #js-summary-title').remove();

    $.ajax({
        url: 'https://community-smmry.p.mashape.com/?SM_WITH_BREAK&SM_API_KEY=' + codes.smmry + '&SM_LENGTH=3&SM_URL=' + encodeURIComponent(url),
        type: 'GET',
        datatype: 'json',
        success: function (data) {
            console.log(data);
            summaryTitle = data.sm_api_title;
            summaryText = data.sm_api_content.split('[BREAK]');
            $('.js-loading').hide();
            $('#js-show-summary').show();
            $('<h4>')
                .attr("id", "jssummary-title")
                .text(summaryTitle)
                .appendTo('#js-show-summary');
            for (var i = 0, l = summaryText.length; i < l; i++) {
                $('<p>')
                    .attr("id", "js-summary-text")
                    .attr("class", "pv")
                    .text(summaryText[i])
                    .appendTo('#js-show-summary');
            }
        },
        error: function (err) {
            $('.js-error').show();
            $('.js-loading').hide();
            $('#js-show-summary').hide();
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Mashape-Authorization", codes.mashape);
        }
    });
}

function done() {
    if (!selectedUrl) {
        alert('Please enter a valid url');
        $('.js-url').focus();
        return;
    }

    Mixmax.done({
        url: selectedUrl,
        title: summaryTitle,
        text: summaryText
    });
}

function cancel() {
    Mixmax.cancel();
}

$('.js-ok').on('click', done);
$('.js-close').on('click', cancel);
