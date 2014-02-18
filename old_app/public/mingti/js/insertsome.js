(function(jQuery){
	jQuery.fn.getCursorPosition = function(){
		if(this.lengh == 0) return -1;
		return $(this).getSelectionStart();
	}
	jQuery.fn.setCursorPosition = function(position){
		if(this.lengh == 0) return this;
		return $(this).setSelection(position, position);
	}
	jQuery.fn.getSelection = function(){
		if(this.lengh == 0) return -1;
		var s = $(this).getSelectionStart();
		var e = $(this).getSelectionEnd();
		return this[0].value.substring(s,e);
	}
	jQuery.fn.getSelectionStart = function(){
		if(this.lengh == 0) return -1;
		input = this[0];

		var pos = input.value.length;

		if (input.createTextRange) {
			var r = document.selection.createRange().duplicate();
			r.moveEnd('character', input.value.length);
			if (r.text == '') 
			pos = input.value.length;
			pos = input.value.lastIndexOf(r.text);
		} else if(typeof(input.selectionStart)!="undefined")
		pos = input.selectionStart;

		return pos;
	}
	jQuery.fn.getSelectionEnd = function(){
		if(this.lengh == 0) return -1;
		input = this[0];

		var pos = input.value.length;

		if (input.createTextRange) {
			var r = document.selection.createRange().duplicate();
			r.moveStart('character', -input.value.length);
			if (r.text == '') 
			pos = input.value.length;
			pos = input.value.lastIndexOf(r.text);
		} else if(typeof(input.selectionEnd)!="undefined")
		pos = input.selectionEnd;

		return pos;
	}
	jQuery.fn.setSelection = function(selectionStart, selectionEnd) {
			if(this.lengh == 0) return this;
			input = this[0];

			if (input.createTextRange) {
					var range = input.createTextRange();
					range.collapse(true);
					range.moveEnd('character', selectionEnd);
					range.moveStart('character', selectionStart);
					range.select();
			} else if (input.setSelectionRange) {
					input.focus();
					input.setSelectionRange(selectionStart, selectionEnd);
			}

			return this;
	}
	jQuery.fn.insertAtCousor = function(myValue){
		var $t=$(this)[0];
		if (document.selection) {
			this.focus();
			sel = document.selection.createRange();
			sel.text = myValue;
			this.focus();
		}else if($t.selectionStart || $t.selectionStart == '0'){
			var startPos = $t.selectionStart;
			var endPos = $t.selectionEnd;
			var scrollTop = $t.scrollTop;
			$t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
			this.focus();
			$t.selectionStart = startPos + myValue.length;
			$t.selectionEnd = startPos + myValue.length;
			$t.scrollTop = scrollTop;
		}else{
			this.value += myValue;
			this.focus();
		}
	}
})(jQuery);