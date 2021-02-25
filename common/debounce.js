
export default {
	/**
	 * 节流  
	 */  
	function throttle(fn, wait = 500, isImmediate = false) {
	  let flag = true;  
	  if (isImmediate) {  
	    return function() {  
	      if (flag) {  
	        fn.apply(this, arguments);  
	        flag = false; 
	        setTimeout(() => {  
	          flag = true  
	        }, wait)  
	      }  
	    }  
	  }  
	  return function() {  
	    if (flag == true) {  
	      flag = false  
	      setTimeout(() => {  
	        fn.apply(this, arguments)  
	        flag = true  
	      }, wait)  
	    }  
	  }  
	}  
	
	//防抖  
	function debounce(fn, wait = 500, isImmediate = false) {  
	  let timerId = null;  
	  let flag = true;  
	  if (isImmediate) {  
	    return function() {  
	      clearTimeout(timerId);  
	      if (flag) {  
	        fn.apply(this, arguments);  
	        flag = false  
	      }  
	      timerId = setTimeout(() => {  
	        flag = true  
	      }, wait)  
	    }  
	  }  
	  return function() {  
	    clearTimeout(timerId);  
	    timerId = setTimeout(() => {  
	      fn.apply(this, arguments)  
	    }, wait)  
	  }  
	}
}
