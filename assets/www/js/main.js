var contactOb;

function init() {
    document.addEventListener("deviceready", phoneReady, false);
}

function phoneReady() {

    x$("#pickContactButton").touchstart(function() {
        window.plugins.contactView.show(
            function(contact) {
                if(typeof contact.phone === "undefined" && typeof contact.email === "undefined") {
                    alert("Sorry, but this contact doesn't have\na phone number or an email address.");
                } else {
                    
                    //copy to global var
                    contactOb = contact;
                    var s = "<p>You will be sending "+contact.name +" information on how to reach you.</p>";
                    if(typeof contact.phone === "undefined") {
                        s+= "<button disabled='true'>Send SMS</button>";
                    } else {
                        s+= "<button id='sendSMSButton'>Send SMS</button>";
                    }
                    if(typeof contact.email === "undefined") {
                        s+= "<button disabled='true'>Send Email</button>";
                    } else {
                        s+= "<button id='sendEmailButton'>Send Email</button>";
                    }
                    x$("#contactChosen").html(s);

                    x$("#sendSMSButton").touchstart(function() {
                       var body = "Find me by cliking here: ";
                       var theUrl = "sms:"+contactOb.phone+"?body="+escape(body);
                       window.location.href=theUrl;
                   });
                    

                }
            },
            function(fail) {
                alert("We were unable to get the contact you selected."+fail.toString());
            }
        );
        
    });
    

}