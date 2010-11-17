(function(jQuery) {
  var $ = jQuery;

  jQuery.fn.extend({
    // Return the nth ancestor of the first matched element.
    ancestor: function ancestor(generation) {
      var ancestor = this[0];
      
      for (var i = 0; i < generation; i++)
        if (ancestor.parentNode)
          ancestor = ancestor.parentNode;
        else
          return null;

      return $(ancestor);
    },
    // Create and return a div that floats above the first
    // matched element.
    overlay: function overlay() {
      var pos = this.offset();
      var overlay = $('<div class="webexplode-overlay">&nbsp;</div>');
      overlay.css({
        top: pos.top,
        left: pos.left,
        height: this.outerHeight(),
        width: this.outerWidth()
      });
      $(document.body).append(overlay);
      return overlay;
    }
  });

  function makeFocused(element) {
    var ancestorIndex = 0;
    var ancestorOverlay = null;
    var overlay = $(element).overlay().addClass("webexplode-focus");

    function setAncestorOverlay(ancestor) {
      if (ancestorOverlay) {
        ancestorOverlay.remove();
        ancestorOverlay = null;
      }
      if (ancestor) {
        ancestorOverlay = $(ancestor).overlay();
        ancestorOverlay.addClass("webexplode-ancestor");
      }
    }

    return {
      element: element,
      upfocus: function upfocus() {
        var ancestor = $(element).ancestor(ancestorIndex + 1);

        if (ancestor.length && ancestor[0] != document) {
          ancestorIndex++;
          setAncestorOverlay(ancestor);
        }
      },
      downfocus: function downfocus() {
        setAncestorOverlay(null);
        if (ancestorIndex > 0) {
          ancestorIndex--;
          var ancestor = $(element).ancestor(ancestorIndex);
          if (ancestorIndex > 0)
            setAncestorOverlay(ancestor);
        }
      },
      unfocus: function unfocus() {
        overlay.remove();
        setAncestorOverlay(null);
      }
    };
  }

  $(window).ready(function() {
    var focused = null;

    document.addEventListener("keydown", function(event) {
      if (event.keyCode == 65 && focused) {
        focused.upfocus();
        event.stopPropagation();
      } else if (event.keyCode == 90 && focused) {
        focused.downfocus();
        event.stopPropagation();
      }
    }, true);
    
    document.addEventListener("mouseout", function(event) {
      event.stopPropagation();
      if (focused)
        focused.unfocus();
      focused = null;
    }, true);
    
    document.addEventListener("mouseover", function(event) {
      event.stopPropagation();
      if (focused)
        focused.unfocus();
      focused = makeFocused(event.target);
    }, true);
    
    if (window.console)
      window.console.log("inspector loaded.");
  });
})(jQuery);
