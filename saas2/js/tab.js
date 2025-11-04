// Initially hide all tab content except the first
$(".tab-content").hide().removeClass("active");
$(".tab-content:first").show().addClass("active");

// Tab Mode: On-click
$(".tabs a").click(function() {
    
    // Hide all tab content and remove active class
    $(".tab-content").hide().removeClass("active");
    
    // Show active tab's content and add active class
    var activeTab = $(this).attr("rel"); 
    $("#" + activeTab).show().addClass("active");
    
    // Update active tab
    $(".tabs a").removeClass("active");
    $(this).addClass("active");
    
    // Update active accordion tab
    $(".accordion-tab").removeClass("active");
    $(".accordion-tab[rel^='" + activeTab + "']").addClass("active");
});

// Accordion Mode: On-click
$(".accordion-tab").click(function() {
    
    // Hide all tab content and remove active class
    $(".tab-content").hide().removeClass("active");
    
    // Show active tab's content and add active class
    var activeTab = $(this).attr("rel"); 
    $("#" + activeTab).show().addClass("active");
    
    // Update active tab
    $(".tabs a").removeClass("active");
    $(".tabs a[rel^='" + activeTab + "']").addClass("active");
    
    // Update active accordion tab
    $(".accordion-tab").removeClass("active");
    $(this).addClass("active");
});
