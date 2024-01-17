import React from "react";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { useTransition, animated } from "react-spring";

const AlgoInfoCard = withStyles({
  root: {
    width: "100%",
    padding: "3%",
    marginBottom: "2vh",
    marginRight: "2%"
  }
})(Card);

const getTitle = algo => {
  switch (algo) {
    case 0:
      return "Dijkstra's Algorithm";
    case 1:
      return "A* Search";
    case 2:
      return "Jump Point Search";
    default:
      return;
  }
};

const getContent = algo => {
  switch (algo) {
    case 0:
      return `Dijkstra's algorithm is a graph traversal method used to find the shortest path from a single source to all nodes in a graph with non-negative edge weights. 
      It continuously updates the shortest known distances to each node and utilizes a priority queue for efficiency. The algorithm's time complexity is O(V^2), which can be reduced to O(V + E log V) using min-priority queues, 
      where V represents vertices and E represents edges.`;
    case 1:
      return `An efficient pathfinding algorithm that optimizes Dijkstra's approach by using heuristics to guide its search, reducing the number of explored nodes. It balances between the shortest path and heuristic functions, often leading to faster solutions.
      Complexity: O(E) where E is the number of edges, but heavily influenced by the heuristic.`;
    case 2:
      return `An optimization of A* for uniform-cost grids, it 'jumps' over several nodes, reducing the number of nodes evaluated. It exploits symmetries, allowing it to skip nodes without missing the shortest path. 
      Complexity: Generally faster than A* in practical scenarios, but shares its worst-case complexity.`;
    default:
      return;
  }
};

const AlgoInfo = props => {
  const transition = useTransition(props.algo, null, {
    from: {
      position: "absolute",
      overflowX: "hidden",
      transform: "translateY(-5vh) scale(0.7)",
      opacity: 0
    },
    enter: { opacity: 1, transform: "translateY(0vh) scale(1)" },
    leave: { opacity: 0, transform: "translateY(5vh) scale(0.7)" }
  });
  return transition.map(({ item, props, key }) => (
    <animated.div key={key} style={props}>
      <AlgoInfoCard>
        <Typography variant="h4">{getTitle(item)}</Typography>
        <br />
        <Typography variant="body1">{getContent(item)}</Typography>
      </AlgoInfoCard>
    </animated.div>
  ));
};

const mapStateToProps = state => {
  return {
    algo: state.algo
  };
};

export default connect(mapStateToProps)(AlgoInfo);
