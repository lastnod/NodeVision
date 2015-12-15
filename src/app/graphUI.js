var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var angular2_1 = require('angular2/angular2');
var user_1 = require('./model/user');
var branch_1 = require('./model/branch');
var node_1 = require('./model/node');
var edge_1 = require('./model/edge');
var graph_1 = require('./model/graph');
var attribute_1 = require('./model/attribute');
var enum_1 = require('./enum');
var GraphUI = (function () {
    function GraphUI() {
        var _this = this;
        //Container
        this.width = 960;
        this.height = 500;
        //node Modal
        this.nodemodalstate = false;
        this.nodemodal = enum_1.Modal.node;
        //attribut
        this.title_state = false;
        //branch Modal
        this.branchmodalstate = false;
        this.branchmodal = enum_1.Modal.branch;
        this.branch = new branch_1.Branch();
        //navbar
        this.branches = new Array();
        this.test(); //TODO remove appel de la base de données  
        //navbar branches
        this.graph.nodes.forEach(function (n) {
            if (_this.branches.indexOf(n.branch) == -1) {
                _this.branches.push(n.branch);
            }
        });
        //canvas du graph
        this.force = d3.layout.force().charge(-120).linkDistance(70).size([this.width, this.height]);
        this.svg = d3.select("body").append("svg").attr("width", this.width).attr("height", this.height);
        this.svg
            .on('contextmenu', function () { _this.branchmodalstate = true; _this.branch = new branch_1.Branch('', '', 'Standard'); });
        this.init_graph();
    }
    GraphUI.prototype.init_graph = function () {
        var _this = this;
        //initialisation du graph           
        this.force
            .nodes(this.graph.nodes)
            .links(this.graph.edges)
            .on("tick", function () { return _this.tick(); })
            .start();
        this.links = this.svg.selectAll(".link")
            .data(this.graph.edges)
            .enter().append("line")
            .attr("class", "link")
            .on("click", function (e) { _this.edge = e; });
        this.nodes = this.svg.selectAll(".node")
            .data(this.graph.nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", 10)
            .style('fill', function (n) { return n.branch.color; })
            .style('stroke', function (n) { return n.branch.color; })
            .on("mousedown", function (n) { _this.mousedown(n); })
            .call(this.force.drag)
            .on("mouseup", function (n) { _this.mouseupNode(n); })
            .call(this.force.drag)
            .on("dblclick", function (n) { _this.nodemodalstate = true; });
        this.nodes.append("title").text(function (n) { return n.name; });
    };
    GraphUI.prototype.redraw = function () {
        var _this = this;
        this.links = this.svg.selectAll(".link");
        var links = this.links.data(this.force.links());
        links.enter().insert("line", ".node").attr("class", "link");
        links.exit().remove();
        var nodes = this.nodes.data(this.force.nodes());
        nodes.enter().append("circle")
            .attr("class", "node")
            .attr("r", 10)
            .style('fill', function (n) { return n.branch.color; })
            .style('stroke', function (n) { return n.branch.color; })
            .on("mousedown", function (n) { _this.mousedown(n); })
            .on("mouseup", function (n) { _this.mouseupNode(n); })
            .call(this.force.drag)
            .on("dblclick", function (n) { _this.nodemodalstate = true; });
        this.nodes.append("title").text(function (n) { return n.name; });
        nodes.exit().remove();
        this.links = this.svg.selectAll(".link");
        this.nodes = this.svg.selectAll(".node");
        this.force.start();
    };
    GraphUI.prototype.tick = function () {
        this.links.attr("x1", function (e) { return e.source.x; })
            .attr("y1", function (e) { return e.source.y; })
            .attr("x2", function (e) { return e.target.x; })
            .attr("y2", function (e) { return e.target.y; });
        this.nodes.attr("cx", function (n) { return n.x; })
            .attr("cy", function (n) { return n.y; });
    };
    GraphUI.prototype.mouseupNode = function (n) {
        if (this.new_link) {
            this.add_edge(this.node, n);
            this.redraw();
            this.svg.on("mousemove", null);
            this.new_link = false;
        }
        this.nodes.call(this.force.drag);
    };
    GraphUI.prototype.mousedown = function (n) {
        var _this = this;
        this.node = n;
        if (d3.event.ctrlKey) {
            this.nodes
                .on('mousedown.drag', null)
                .on('touchstart.drag', null);
            this.new_link = true;
            this.line = this.svg.append("line")
                .attr("class", "link")
                .attr("x1", n.x)
                .attr("y1", n.y)
                .attr("x2", n.x)
                .attr("y2", n.y);
            this.svg.on("mousemove", function () { _this.mousemove(); });
        }
    };
    GraphUI.prototype.mousemove = function () {
        this.m = d3.mouse(d3.event.currentTarget);
        this.line
            .attr("x2", this.m[0])
            .attr("y2", this.m[1]);
    };
    GraphUI.prototype.add_edge = function (source, target) {
        //ajouter a la base de données récup l'id  
        if (source != target) {
            var edge = new edge_1.NVEdge(2264, 'undfined', source, target);
            this.graph.edges.push(edge);
        }
    };
    GraphUI.prototype.add_attribute = function () {
        this.node.attributes.push(new attribute_1.Attribute('', '', ''));
    };
    GraphUI.prototype.delete_attribute = function (attribute) {
        this.node.attributes.splice(this.node.attributes.indexOf(attribute), 1);
    };
    GraphUI.prototype.add_node = function () {
        //appel bdd (TEST)
        var node = new node_1.NVNode(9999, 'test', this.node.branch, Array()); //TODO Rempalcer
        var edge = new edge_1.NVEdge(9999, 'blabla', this.node, node); //TODO Rempalcer
        //reconstruction
        this.graph.nodes.push(node);
        this.graph.edges.push(edge);
        this.redraw();
    };
    GraphUI.prototype.delete_node = function () {
        var _this = this;
        //this.graph.edges.splice(this.graph.edges.findIndex(x => x.source.id_node == this.node.id_node),1);
        //this.graph.edges.splice(this.graph.edges.findIndex(x => x.target.id_node == this.node.id_node),1);
        this.graph.nodes.splice(this.graph.nodes.indexOf(this.node), 1);
        var toSplice = this.graph.edges.filter(function (l) { return (l.source === _this.node) || (l.target === _this.node); });
        toSplice.map(function (l) { _this.graph.edges.splice(_this.graph.edges.indexOf(l), 1); });
        this.redraw();
    };
    GraphUI.prototype.delete_node_and_sons = function () {
    };
    GraphUI.prototype.update_node = function (node_name) {
        this.node.name = node_name;
        this.title_state = false;
    };
    GraphUI.prototype.show_branch = function (branch) {
    };
    GraphUI.prototype.add_branch = function (name, color) {
        this.branch.name = name;
        this.branch.color = color;
        var nd = new node_1.NVNode(13, "Nouveau noeud", this.branch, Array());
        this.branches.push(this.branch);
        this.graph.nodes.push(nd);
        this.redraw();
        this.branchmodalstate = false;
    };
    GraphUI.prototype.update_branch = function (branch) {
        this.branchmodalstate = true;
        this.branch = branch;
    };
    GraphUI.prototype.delete_branch = function (branch) {
        var _this = this;
        //trouver le noeud parent le plus élevé et faire this.delete_node_and_sons
        var nodesbranch = Array();
        this.graph.nodes.forEach(function (element) {
            if (element.branch == branch) {
                nodesbranch.push(element);
            }
        });
        //supprime la branche(groupe)
        this.branches.splice(this.branches.indexOf(nodesbranch[0].branch), 1);
        //supprime les edges de la branche
        nodesbranch.forEach(function (elt) {
            _this.graph.edges.forEach(function (element) {
                if (element.source == elt || element.target == elt)
                    _this.graph.edges.splice(_this.graph.edges.indexOf(element), 1);
            });
        });
        //supprime les noeuds de la branche
        nodesbranch.forEach(function (element) {
            _this.graph.nodes.splice(_this.graph.nodes.indexOf(element), 1);
        });
        console.log(this.graph.nodes);
        this.redraw();
    };
    GraphUI.prototype.delete_edge = function () {
    };
    GraphUI.prototype.update_edge = function () {
    };
    GraphUI.prototype.test = function () {
        var neo_init = "MATCH (u:User)-[r:RELTYPE*]->(n:Node) WHERE u.mail = 'benjamin.troquereau@gmail.com' RETURN n,r";
        ///RECUP DU USER VIA LA CONNEXION mail:benjamin.troquereau@gmail.com//////////////////////// TODO
        var user = new user_1.User('benjamin.troquereau@gmail.com', 'Troquereau', 'Benjamin', null, null);
        ////////////////////////////////////////////////////////////////////////////////////////////
        /// request to init the graph
        var neo_init = "MATCH (u:User),(n:Node) WHERE u.mail = '" + user.matricule + "' AND (u)-[*]->(n) RETURN n";
        var response;
        jQuery.ajax({
            type: "POST",
            async: false,
            url: "http://5.196.66.87/db/data/cypher",
            contentType: "application/json",
            data: JSON.stringify({ "query": neo_init, "params": {} }),
            success: function (data) {
                response = data.data;
            }
        });
        console.log(response);
        // hydratation des noeuds
        var nodes = new Array();
        response.forEach(function (n) {
            n.forEach(function (o) {
                console.log(typeof o);
                nodes.push(new node_1.NVNode(o.metadata.id, o.data.name, new branch_1.Branch('name', 'ffffff', 'Standard'), new Array()));
            });
        });
        // hydratation des aretes
        var edges = new Array();
        //console.log(nodes)
        ///////////////////////TEST///////////////////////
        this.graph = new graph_1.Graph(1, 'first');
        var e1 = new edge_1.NVEdge(1, 'link1', nodes[0], nodes[1]);
        var e2 = new edge_1.NVEdge(2, 'link2', nodes[0], nodes[2]);
        edges.push(e1, e2);
        this.graph.nodes = nodes;
        this.graph.edges = edges;
        ///////////////////////////////////////////////////
        /* this.node = new NVNode(1,
             'fire',
             b1,
             [new User('0001', 'troquereau', 'benjamin', new PreferencePopup(true, false, false))],
             [new User('0001', 'troquereau', 'benjamin', new PreferencePopup(true, false, false))],
             [new Attribute('Test', 'Test', 'Test')], null, null);*/
        ///////////////////////////////////////////////////
    };
    GraphUI = __decorate([
        angular2_1.View({
            templateUrl: 'app/graphUI.html',
            directives: [angular2_1.CORE_DIRECTIVES]
        }),
        angular2_1.Component({
            selector: 'graph'
        }), 
        __metadata('design:paramtypes', [])
    ], GraphUI);
    return GraphUI;
})();
exports.GraphUI = GraphUI;
angular2_1.bootstrap(GraphUI);
//# sourceMappingURL=graphUI.js.map