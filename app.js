var ViewModel = function() {
    var self = this;

    self.barberShops = ko.observableArray(barberShops);

    self.clickFilter = function() {
        var filter = $('#filter').val();                    

        if (filter.length > 0) {
            var selectedShops = _.filter(self.barberShops(), function(b) {
                return _.includes(b.name.toLowerCase(), filter.toLowerCase()); 
            });

            self.barberShops.removeAll();
            for (var i = 0; i < selectedShops.length; i++)                        
                self.barberShops.push(selectedShops[i]);     
        }                                        
    };
};
ko.applyBindings(new ViewModel());