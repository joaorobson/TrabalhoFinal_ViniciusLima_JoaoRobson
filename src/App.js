import React from "react";
import {
  Button,
  Divider,
  Grid,
  Form,
  List,
  Header,
  Table
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

const Inf = 1000000;

class Knapsack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [
        { id: 1, origin: 0, dest: 5, weight:8 },
        { id: 2, origin: 0, dest: 1 , weight:10},
        { id: 3, origin: 1, dest: 3 , weight:2},
        { id: 4, origin: 2, dest: 1, weight:1},
        { id: 5, origin: 3, dest: 2 , weight:-2},
        { id: 6, origin: 4, dest: 3 , weight:-1},
        { id: 7, origin: 5, dest: 4 , weight:1},
        { id: 7, origin: 4, dest: 1 , weight:-4}
      ],
			distinctNodes: new Set()
    };
  }

  addNode() {
    let nodes = this.state.nodes;
    let origin = parseInt(this.state.origin);
    let dest = parseInt(this.state.dest);
    let weight = parseInt(this.state.weight);
		
    nodes.push({
      id: this.state.nodes.length + 1,
      origin: origin,
      dest: dest,
			weight: weight 
    });

    this.setState({ nodes: nodes });
  }

  removeItem(id) {
    this.setState(prevState => ({
      nodes: prevState.nodes.filter(el => el.id !== id)
    }));
  }

  generateDP() {
    this.setState({ showDP: true });
  }

  getNodes() {
      var distinctNodes = [] 
      for(let i = 0; i < this.state.nodes.length; i++){
          let o = this.state.nodes[i].origin	
          let d = this.state.nodes[i].dest
          if(distinctNodes.indexOf(o) < 0){
              distinctNodes.push(o)
          }
          if(distinctNodes.indexOf(d) < 0){
              distinctNodes.push(d)
          }
      }
      return distinctNodes	
  }


  mountTableHeader() {

    return (
      <Table.Row>
        <Table.HeaderCell />
        {[...Array(this.getNodes().length).keys()].map(v => {
          return <Table.HeaderCell>{v}</Table.HeaderCell>;
        })}
      </Table.Row>
    );
  }

  mountRows() {
    var CostTable = this.bellmanFord(0);

    if(CostTable.length === 0){
      return <h2>Grafo com ciclo negativo</h2>
    }
    return this.getNodes().map((i, ix) => {
      return (
        <Table.Row>
          <Table.Cell width={1}>Iteração {ix}</Table.Cell>
          {CostTable[ix].map((j, jx) => {
            return (ix === this.getNodes().length - 1) ? <Table.Cell style={{backgroundColor: "#8ce885"}}>{j}</Table.Cell> : <Table.Cell>{j}</Table.Cell>
          })}
        </Table.Row>
      );
    });
  }

  bellmanFord(src){
    var CostTable = []
    var dist = [];

    for(var i=0; i < this.getNodes().length; i++){
      dist.push(Inf);
    }
    dist[src] = 0

    for(i = 0; i < this.getNodes().length; i++){
      CostTable.push(dist.slice());
      for(let a = 0; a < this.state.nodes.length; a++){
        let u = this.state.nodes[a]["origin"];
        let v = this.state.nodes[a]["dest"];
        let w = this.state.nodes[a]["weight"];
        if(dist[u] !== Inf && (dist[u] + w) < dist[v]){
          dist[v] = dist[u] + w;
        }
      }
    }

    for(let a = 0; a < this.state.nodes.length; a++){
      let u = this.state.nodes[a]["origin"];
      let v = this.state.nodes[a]["dest"];
      let w = this.state.nodes[a]["weight"];
      if(dist[u] !== Inf && (dist[u] + w) < dist[v]){
        alert("Grafo contém ciclo negativo!");
        return [];
      }
    }


    return CostTable;
  }

  mountDPMatrix() {
    return (
      <Table textAlign="center" definition>
        <Table.Header>{this.mountTableHeader()}</Table.Header>

        <Table.Body>{this.mountRows()}</Table.Body>
      </Table>
    );
  }

  nodesList() {
    return (
      <List celled ordered>
        {this.state.nodes.map(item => (
          <List.Item>
            <Button
              onClick={() => this.removeItem(item.id)}
              color="red"
              floated="right"
            >
              Remover
            </Button>
            <List.Content>
              <List.Description>
                <b>Origem:</b> {item.origin}
              </List.Description>
              <List.Description>
                <b>Destino:</b> {item.dest}
              </List.Description>
              <List.Description>
                <b>Peso:</b> {item.weight}
              </List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>
    );
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  showTitle() {
    setTimeout(() => {
      this.setState(prevState => ({
        color: "red",
        colorSetted: true
      }));
    }, 2000);
  }

  componentDidUpdate() {
    if (this.state.showDP && !this.state.colorSetted) {
      this.showTitle();
    }
  }

  setWeightLimit(weightLimit){
    this.setState({weightLimit: parseInt(this.state.limit)})
  }

  render() {
    return (
      <Grid columns="equal" style={{ margin: "40px" }}>
        <Header>Bellman Ford</Header>
        <Grid.Row>
          <Grid.Column>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  name="origin"
                  onChange={this.handleChange}
                  type="number"
                  min="0"
                  fluid
                  placeholder="Insira um nó de origem"
                />
                <Form.Input
                  name="dest"
                  onChange={this.handleChange}
                  type="number"
                  min="0"
                  fluid
                  placeholder="Insira um nó de destino"
                />
                <Form.Input
                  name="weight"
                  onChange={this.handleChange}
                  type="number"
                  fluid
                  placeholder="Insira um peso"
                />
              </Form.Group>
              <Form.Button
                onClick={this.addNode.bind(this)}
                disabled={!this.state.origin || !this.state.dest || !this.state.weight}
              >
                Adicionar nós no grafo 
              </Form.Button>
              <Divider hidden />
            </Form>
          </Grid.Column>
          <Grid.Column>
            {this.nodesList()}
          </Grid.Column>
          <Button style={{ height: "114px" }} onClick={() => this.generateDP()}>
            Mostrar DP
          </Button>
          {this.state.showDP && this.mountDPMatrix()}
        </Grid.Row>
      </Grid>
    );
  }
}

export default Knapsack;
