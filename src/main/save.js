function restoreBackup() {
  if (!localStorage || !JSON) {
    return
  }

  try {
    const backup = JSON.parse(localStorage['fsm'])
    backup.nodes.forEach((backupNode) => {
      const node = new Node(backupNode.x, backupNode.y)
      node.isAcceptState = backupNode.isAcceptState
      node.text = backupNode.text
      nodes.push(node)
    })

    backup.links.forEach((backupLink) => {
      let link = null
      const directed = backupLink.directed
      if (backupLink.type === 'SelfLink') {
        link = new SelfLink(nodes[backupLink.node], undefined, directed)
        link.anchorAngle = backupLink.anchorAngle
        link.text = backupLink.text
      } else if (backupLink.type === 'StartLink') {
        link = new StartLink(nodes[backupLink.node], undefined, directed)
        link.deltaX = backupLink.deltaX
        link.deltaY = backupLink.deltaY
        link.text = backupLink.text
      } else if (backupLink.type === 'Link') {
        link = new Link(
          nodes[backupLink.nodeA],
          nodes[backupLink.nodeB],
          directed,
        )
        link.parallelPart = backupLink.parallelPart
        link.perpendicularPart = backupLink.perpendicularPart
        link.text = backupLink.text
        link.lineAngleAdjust = backupLink.lineAngleAdjust
      }
      if (link != null) {
        links.push(link)
      }
    })
  } catch (e) {
    localStorage['fsm'] = ''
  }
}

function backupData() {
  const backup = {
    nodes: [],
    links: [],
  }

  nodes.forEach((node) => {
    const backupNode = {
      x: node.x,
      y: node.y,
      text: node.text,
      isAcceptState: node.isAcceptState,
    }
    backup.nodes.push(backupNode)
  })

  links.forEach((link) => {
    let backupLink = null
    if (link instanceof SelfLink) {
      backupLink = {
        type: 'SelfLink',
        node: nodes.indexOf(link.node),
        text: link.text,
        anchorAngle: link.anchorAngle,
        directed: link.directed,
      }
    } else if (link instanceof StartLink) {
      backupLink = {
        type: 'StartLink',
        node: nodes.indexOf(link.node),
        text: link.text,
        deltaX: link.deltaX,
        deltaY: link.deltaY,
        directed: link.directed,
      }
    } else if (link instanceof Link) {
      backupLink = {
        type: 'Link',
        nodeA: nodes.indexOf(link.nodeA),
        nodeB: nodes.indexOf(link.nodeB),
        text: link.text,
        lineAngleAdjust: link.lineAngleAdjust,
        parallelPart: link.parallelPart,
        perpendicularPart: link.perpendicularPart,
        directed: link.directed,
      }
    }
    if (backupLink != null) {
      backup.links.push(backupLink)
    }
  })

  return backup
}

function saveBackup() {
  if (!localStorage || !JSON) {
    return
  }

  const backup = backupData()

  localStorage['fsm'] = JSON.stringify(backup)
}
