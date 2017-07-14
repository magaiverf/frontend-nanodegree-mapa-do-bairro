var ViewModel = function() {
    var self = this;

    self.barberShops = ko.observableArray(barberShops.slice(0));

    self.clickFilter = function() {
        var filter = $('#filter').val();                    

        self.barberShops.removeAll();
        if (filter.length > 0) {
            var selectedShops = _.filter(barberShops, function(b) {
                return _.includes(b.name.toLowerCase(), filter.toLowerCase()); 
            });

            for (var i = 0; i < selectedShops.length; i++)                        
                self.barberShops.push(selectedShops[i]);     
        } else {            
            for (var j = 0; j < barberShops.length; j++)                        
                self.barberShops.push(barberShops[j]);  
        }                                       
    };
};
ko.applyBindings(new ViewModel());