
$(function () {


    $.ajaxSetup({cache: true});

    // Get repositories from the GitHub API.
    if ($('#projects').length) {
        $.getJSON('https://api.github.com/users/fervillarrealm/repos?callback=?', function (repos) {
            var i, repoCount = repos.data.length, now = Date.now(),
                projectsActive = document.getElementById('projects-active'),
                
                $projects = $('#projects'), $projectsLoading = $('#projects-loading'), $proyectosLista = $('#proyectos-lista'),
                dt, dd, link, meta, panel, panelBody, caption, cardDescription, cardText, pCardText, spanStars, spanForks, spanUpdated,
                spanStarsSub, spanForksSub, spanUpdatedSub, cardImage, cardImageSub, cardTitle, cardLink, geoPattern;

            if (typeof repos.data.message !== 'undefined') {
                // Handle API errors.
                $projects.html(
                    '<p style="color:#c00;"><strong>GitHub API Error:</strong> ' +
                        repos.data.message + '</p>'
                );
                $projects.slideDown(200);
                $projectsLoading.fadeOut(200);
                $projects.fadeTo(200, 1);
                return;
            }

            // Filtrar por forks, estrellas y fecha
            repos.data.sort(function (repoA, repoB) {
                var networkRepoA = repoA.forks_count + repoA.stargazers_count,
                    networkRepoB = repoB.forks_count + repoB.stargazers_count,
                    pushedRepoA = Date.parse(repoA.pushed_at),
                    pushedRepoB = Date.parse(repoB.pushed_at);
                if (networkRepoA === networkRepoB) {
                    return pushedRepoB - pushedRepoA;
                } else {
                    return networkRepoB - networkRepoA;
                }
            });

            for (i = 0; i < repoCount; i++) {
                if (repos.data[i].fork) {
                    continue;
                }
                
                dt = document.createElement('dt');
                link = document.createElement('a');
                link.innerText = repos.data[i].name;
                link.href = repos.data[i].html_url;
                link.target = '_blank';
                dt.appendChild(link);
                
                
                cardImage = document.createElement('div');
                cardImage.className = "card-image geopattern";
                
                var patternId = document.createAttribute("data-pattern-id")
                patternId.value = repos.data[i].name;
                cardImage.setAttributeNode(patternId);
                
                cardImageSub = document.createElement('div');
                cardImageSub.className = "card-image-cell";
                
                cardTitle = document.createElement('h3');
                cardTitle.className = "card-title";
                
                cardLink = document.createElement('a');
                cardLink.innerText = repos.data[i].name;
                cardLink.href = repos.data[i].html_url;
                cardLink.target = '_blank';
                
                cardTitle.appendChild(cardLink);
                cardImageSub.appendChild(cardTitle);
                cardImage.appendChild(cardImageSub);
                
                caption = document.createElement('div');
                caption.className = "caption";
                cardDescription = document.createElement('div');
                cardDescription.className = "card-description";
                cardText = document.createElement('div');
                cardText.className = "card-text";
                pCardText = document.createElement('p');
                pCardText.className = "card-text";
                spanStars = document.createElement('span');
                spanForks = document.createElement('span');
                spanUpdated = document.createElement('span');
                
                var attStars = document.createAttribute("data-toggle")
                attStars.value = "tooltip";
                var attForks = document.createAttribute("data-toggle")
                attForks.value = "tooltip";
                var attUpdated = document.createAttribute("data-toggle")
                attUpdated.value = "tooltip";
                
                spanStars.setAttributeNode(attStars);
                spanStars.className = "meta-info";
                spanStars.title = repos.data[i].stargazers_count + " stars";
                
                spanForks.setAttributeNode(attForks);
                spanForks.className = "meta-info";
                spanForks.title = repos.data[i].forks + " forks";
                
                spanForksSub = document.createElement('span');
                spanForksSub.className = "fa fa-code-fork";
                spanForksSub.innerHTML = " " + repos.data[i].forks;
                
                spanUpdated.setAttributeNode(attUpdated);
                spanUpdated.className = "meta-info";
                spanUpdated.title = "Last updated：" + repos.data[i].updated_at;
                
                spanStarsSub = document.createElement('span');
                spanStarsSub.className = "fa fa-star";
                spanStarsSub.innerHTML = " " + repos.data[i].stargazers_count;
                
                spanUpdatedSub = document.createElement('span');
                spanUpdatedSub.className = "fa fa-clock-o";
                spanUpdatedSub.innerHTML = " " + formatDate(repos.data[i].updated_at);
                
                spanStars.appendChild(spanStarsSub);
                spanUpdated.appendChild(spanUpdatedSub);
                spanForks.appendChild(spanForksSub);
                
                cardText.appendChild(spanStars);
                cardText.appendChild(spanForks);
                cardText.appendChild(spanUpdated);
                
                
                panel = document.createElement('div');
                panel.className = (i % 2 == 0) 
                    ? "col-md-6 card text-center wow bounceInLeft" 
                    : "col-md-6 card text-center wow bounceInRight";
                
                panelBody = document.createElement('div');
                panelBody.className = "thumbnail";
                
                panel.append(panelBody);
                
                pCardText.append(repos.data[i].description + " (" + repos.data[i].language + ")");;
                cardDescription.appendChild(pCardText);
                
                caption.appendChild(cardDescription);
                caption.appendChild(cardText);
                
                panelBody.appendChild(cardImage);
                panelBody.appendChild(caption);
                
                $proyectosLista.append(panel);
            }

            $projects.slideDown(200);
            $projectsLoading.fadeOut(200);
            $projects.fadeTo(200, 1);
            
        });
        
        
        setTimeout(function (){
            
            $("body").tooltip({ selector: '[data-toggle=tooltip]' });
            
            $('.geopattern').each(function(){
                //console.log($(this).geopattern($(this)));
                $(this).geopattern($(this).data('pattern-id'));
            }); 
        }, 800);
        
    }
    
    

    // Fix scrolling issue on Mobile Safari.
    if ($(window).width() < 768) {
        $(window).scrollTop(0);
    }

    // Make external links open in a new tab/window.
    (function () {
        var urlRegExp = new RegExp('^(\/|(https?:)?\/\/' + window.location.host + ')');
        $('a').each(function () {
            var $a = $(this);
            if (!urlRegExp.test($a.attr('href'))) {
                $a.attr('target', '_blank');
            }
        });
    })();

});

function formatDate (jsonDate) {

    var subDate = jsonDate.replace('-','').replace('-','').substring(0,8);
    if (jsonDate == null) return "";
    if (jsonDate.length == 0) return "";

    var monthOfYear = parseInt(subDate.substring(4,6));
    var dayOfMonth = parseInt(subDate.substring(6,8));
    var year = parseInt(subDate.substring(0,4));
    
    if (monthOfYear < 10)
        monthOfYear = "0" + monthOfYear;

    if (dayOfMonth < 10)
        dayOfMonth = "0" + dayOfMonth;

    var output = dayOfMonth + "/" + monthOfYear + "/" + year;
    return output;
}



$(function (){
   $('a[href*=#]').on('click', function(e)
	{
		e.preventDefault();
		
		if( $( $.attr(this, 'href') ).length > 0 )
		{
			$('html, body').animate(
			{
				scrollTop: $( $.attr(this, 'href') ).offset().top
			}, 400);
		}
		return false;
	}); 
	
	$('#navbar-example').on('activate.bs.scrollspy', function() 
	{
		window.location.hash = $('.nav .active a').attr('href').replace('#', '#/');
	});
	
	lnStickyNavigation = $('.scroll-down').offset().top + 20;
	
	$(window).on('scroll', function() 
	{  
		stickyNavigation();  
	});  
	
	$('.navbar li a').click(function(event) 
	{
		$('.navbar-collapse').removeClass('in').addClass('collapse');
	});
	
	stickyNavigation();
});

var lnStickyNavigation;

function stickyNavigation()
{         
	if($(window).scrollTop() > lnStickyNavigation) 
	{   
		$('body').addClass('fixed');  
	} 
	else 
	{  
		$('body').removeClass('fixed');   
	}  
}
