$( document ).ready(function() {

        //BREAKPOINTS DECLARATIONS
    
    var isBreakPoint = function (bp) {
        var bps = [576, 768, 992, 1200], //Based on Bootstrap values
            w = $(window).width(),
            min, max
        for (var i = 0, l = bps.length; i < l; i++) {
          if (bps[i] === bp) {
            min = bps[i-1] || 0
            max = bps[i]
            break
          }
        }
        return w > min && w <= max
    }
    
    function breakpoints(sm, md, lg, xl){
        if(isBreakPoint(sm)){ //sm
            $(".project").removeClass("square");
        }
        else if(isBreakPoint(md)){ //md
            $(".project").removeClass("square");
        }
        else if(isBreakPoint(lg)){ //lg
            $(".project").removeClass("square");
        }
        else if(isBreakPoint(xl)){ //xl
            $("#main").width(100 * $("#main").children().length + "%");
            //$("#pointer").height(2 + "%");
            $.jInvertScroll(['#main']);
        }
        else {
            console.log("device screen out of range");
            $("#main").width(100 * $("#main").children().length + "%");
            //$("#pointer").height(2 + "%");
            $.jInvertScroll(['#main']);
        }
    }
    
    breakpoints(576, 768, 992, 1200);
    

        //SQAURE ELEMENTS PROPORTION
    
    function setSquare(){
        $(".square").each(function(){
            var m = $(this).height() + $(this).width();
            $(this).height(m);
            $(this).width(m);
        });
    }
    
    setSquare();
    
    function makeSquare(){
        $(".square").each(function(){
            $(this).height($(this).width());
        });
    }
    
    window.addEventListener("resize", function(){
        $(".project").addClass("square");
        breakpoints(576, 768, 992, 1200);   
        makeSquare();
    });
    
    
        //MOUSE CURSOR
    
    var mouseX=window.innerWidth/2, mouseY=window.innerHeight/2;
    
    var outer_pointer = {
      outerP:$('#pointer_follower'),
      x:window.innerWidth/2, y:window.innerHeight/2, w:$('#pointer_follower').width(), h:$('#pointer_follower').height(),
      update:function(){
        l = this.x - this.w/2;
        t = this.y - this.h/2;

        this.outerP.css({
            left: l,
            top: t
        });
      }
    }
    
    var inner_pointer = {
        innerP: $('#pointer'),
        x:window.innerWidth/2, y:window.innerHeight/2, w:$('#pointer').width(), h:$('#pointer').height(),
        update: function(){
            this.innerP.css({
                left:  (mouseX -= this.innerP.width()/2), //pageX would take into account the scrolling and as such make it appear somewhere in the universe outside the visible part: read more on https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX & https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX
                top:   (mouseY -= this.innerP.height()/2)
            }).animate({
                opacity: 1
            }, 600);
        }
    }

    $('body').on('mousemove', function(e){
        inner_pointer.update();
        outer_pointer.outerP.animate({ //it would be ok just for the first movement, maybe you can fine tune this
                opacity: 0.3
            }, 600);
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    setInterval (move,2000/60)

    function move(){
      outer_pointer.x = lerp (outer_pointer.x, mouseX, 0.3);
      outer_pointer.y = lerp (outer_pointer.y, mouseY, 0.3);
      outer_pointer.update(); 
    }

    function lerp (start, end, amt){
      return (1-amt)*start+amt*end
    }
    
    
        //MOUSE ON INTERACTABLE ELEMENTS
    
    $('#cover span, #back, a, .project').on({ //interactable elements, for which the mouse should shrimp
        mouseenter: function(){
            inner_pointer.innerP.toggleClass('animate');
            outer_pointer.outerP.toggleClass('animate');
    },
        mouseleave: function(){
            inner_pointer.innerP.toggleClass('animate');
            outer_pointer.outerP.toggleClass('animate');
    }
    });
    
    var pointerCol = inner_pointer.innerP.css('background-color');
    
    $('.multipleImg').on({
        mouseenter: function(){
            inner_pointer.innerP.html('&#10140').css({
                'background-color': 'transparent'
            });
    },
        mouseleave: function(){
            inner_pointer.innerP.html('').css({
                'background-color': pointerCol
            });
    }
    });

    
        //REDIRECT FROM COVER INTO SECTION OF THE SAME PAGE
    
    function moveFromTo(startEl, endEl) {
        startEl.click(function(e) {
            e.preventDefault();
            
            
            var left = endEl.position().left;
            var total = $('.scroll').width();
            var perc = left / (total - $(window).width()) * 100;
            var final = (($('html').height() - $(window).height())/ 100 * perc);

            $('html, body').animate({scrollTop: final}, 1500);
        });
    }
    
    moveFromTo($("#cover h1 a"), $("#description"));
    moveFromTo($("#cover h2 a"), $("#projects"));
    moveFromTo($("#cover p a"), $("#contacts"));
        
        //GET PROJECTS NAMES
    
    $.getJSON("../database.json", function(data){
        $( '.project' ).each(function(index) {
            var prj = data.projects[index];
            $(this).attr("id", prj.id);
            $(this).children("p").append("<a>" + prj.name + "</a></br>" + prj.subName);
            $(this).children("div").css("background-image", "url(../media/images/covers/" + prj.cover + ")");
            
            $('.project p').width($('.project').width());
        });
    });
    
        //REDIRECT TO PROJECTS
    
    function goToProject(el){
        el.click(function(event) {
            event.preventDefault();
            var project = $(this).attr("id");
            var page = "../projects/"+project+".html"; // Set page path
            window.location.assign(page); // Redirect to page path
            breakpoints(576, 768, 992, 1200);
        });
    }

    goToProject($(".project"));
    
    $("#back").click(function(event) {
        event.preventDefault();
        console.log("attempting go back");
        window.location.assign("../index.html");
        breakpoints(576, 768, 992, 1200);
    });

    
        //CLIK-TO-CHANGE IMAGES
    
    function changeImg(target){
        var img = target.attr('src').split("/").pop().split('.')[0];
        var currentVersion = target.attr('src').split("/").pop().split('.')[1];
        var nextVersion = parseInt(currentVersion) + 1;
        console.log(nextVersion);
        
        var nextImg = '../media/images/altromer/' + img + '.' + nextVersion + '.svg';
        $.get(nextImg)
        .done(function() { 
            target.attr('src', nextImg);
        }).fail(function() {
            console.log("image don't exist, returning first image");
            nextImg = '../media/images/altromer/' + img + '.1.svg';
            target.attr('src', nextImg);
        });
    };
    
    $('.multipleImg').click(function() {
        changeImg($(this));
    });
    
    
}); //END OF DOCUMENT READY