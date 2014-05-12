$('.slider-container').on('smartslider.slide', function(e, data) {
	var leftPos = data * 74;
	$('.imglist').css({left: -leftPos});
	$('.imglist img').removeClass('is-selected');
	$($('.imglist img')[data]).addClass('is-selected');
});
$('.slider-container').on('smartslider.change', function(e, data) {
	var leftPos = data * 74;
	$('.imglist').css({left: -leftPos});
	$('.imglist img').removeClass('is-selected');
	$($('.imglist img')[data]).addClass('is-selected');
	//console.log("change - " + data);
});

$('.sliderwrap').on('mouseover', function() {
	$('.imglistwrap').css('visibility', 'visible');
});

$('.sliderwrap').on('mouseout', function() {
	$('.imglistwrap').css('visibility', 'hidden');
});