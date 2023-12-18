var nodesFormat = '[';
let reactionArray = [];
var cyFormat = '';
var nodesFormat = "";
var edgesFormat = "";
let edgesArray = [];


var testcyto =  
[
  { data: { id: 'reactant: 69507' } }, 
  { data: { id: 'product: 439427' } },

  { data: { id: 'reactant: 122357' } }, 
  { data: { id: 'reactant: 638308' } }, 
  { data: { id: 'reactant: 962' } }, 
  { data: { id: 'product: 1061' } }, 

  { data: { id: 'reactant: 160647' } }, 
  { data: { id: 'product: 1061' } }, 

  { data: { id: '1', source: 'reactant: 69507' , target: 'product: 439427' } },
  { data: { id: '2.0', source: 'reactant: 122357' , target: 'product: 1061' } },
  { data: { id: '2.1', source: 'reactant: 638308' , target: 'product: 1061' } },
  { data: { id: '2.3', source: 'reactant: 962' , target: 'product: 1061' } },
  { data: { id: '3', source: 'reactant: 160647' , target: 'product: 1061' } },
]

var testcyFormat =[{ data: { id: 'reactant: 69507' } }, 
{ data: { id: 'product: 439427' } }, 
{ data: { id: 'reactant: 122357' } }, 
{ data: { id: 'reactant: 638308' } }, 
{ data: { id: 'reactant: 962' } }, 
{ data: { id: 'product: 1061' } }, 
{ data: { id: 'product: 160647' } }, 
{ data: { id: 'reactant: 160647' } }, 
{ data: { id: 'product: 1061' } }, 
{ data: { id: 'product: 5460271' } }, 
{ data: { id: '0', source: 'reactant: 69507', target: 'product: 439427' } },
{ data: { id: '1', source: 'reactant: 122357', target: 'product: 1061' } },
{ data: { id: '1', source: 'reactant: 122357', target: 'product: 160647' } },
{ data: { id: '1', source: 'reactant: 638308', target: 'product: 1061' } },
{ data: { id: '1', source: 'reactant: 638308', target: 'product: 160647' } },
{ data: { id: '1', source: 'reactant: 962', target: 'product: 1061' } },
{ data: { id: '1', source: 'reactant: 962', target: 'product: 160647' } },
{ data: { id: '2', source: 'reactant: 160647', target: 'product: 1061' } },
{ data: { id: '2', source: 'reactant: 160647', target: 'product: 5460271' } },
]

function processData(data) 
{
    DataArray = createReationArray(data);
    createNodes(reactionArray);
    createEdges(reactionArray);
    return cyFormat;
}

function createReationArray(data)
{
  const table = data.split('\n').slice(1, -1); // Separate the lines and remove the header
  table.forEach(element => {
      const row = element.split(','); // Separate the elements of each line
      const cidsreactant = row[14]; // Isolating the reactants
      const cidsproduct = row[15]; // Isolating the products

      const reactArray = [];
      const reactant = cidsreactant.split('|'); // Separating the reactants
      reactant.forEach(function (obj) {
          reactArray.push(parseInt(obj));
      });

      const productArray = [];
      const product = cidsproduct.split('|'); // Separating the products
      product.forEach(function (obj) {
          productArray.push(parseInt(obj));
      });

      const oneReactionArray = [reactArray, productArray]; 
      reactionArray.push(oneReactionArray);
  });
  //console.log(reactionArray);
  return reactionArray;
}

function createNodes(reactionArray)
{
    for (let i = 0; i < reactionArray.length; i++) 
    {
      for (let j = 0; j < reactionArray[i].length; j++) 
      {
          if ((j%2)==0)
          {
              for (let k = 0; k < reactionArray[i][j].length; k++) 
              {
                nodesFormat += '{ data: { id: \'reactant: ' + reactionArray[i][j][k] + '\' } }, \n';
              }
          }
          else
          {
              for (let k = 0; k < reactionArray[i][j].length; k++) 
              {
                nodesFormat += '{ data: { id: \'product: ' + reactionArray[i][j][k] + '\' } }, \n';
              }
          }
      }
    }
    cyFormat += nodesFormat
    return cyFormat;
}

function createEdges(reactionArray)
{
    ///// Creation of the edges 
    for (let i = 0; i < reactionArray.length; i++) 
    {
        for (let k = 0; k < reactionArray[i][0].length; k++) 
          {
            let reactFormat = '{ data: { id: \'' + i + '\', source: \'reactant: ' + reactionArray[i][0][k] + '\',';
            if (reactionArray[i][1].length==1)
            {
              for (let k = 0; k < reactionArray[i][1].length; k++)
              {
                let prodFormat = ' target: \'product: ' + reactionArray[i][1][k] + '\' } }, \n';
                cyFormat += reactFormat + prodFormat;
              }
            }
            if (reactionArray[i][1].length>1)
            {
              for (let k = 0; k < reactionArray[i][1].length; k++)
              {
                let prodFormat = ' target: \'product: ' + reactionArray[i][1][k] + '\' } }, \n';
                cyFormat += reactFormat + prodFormat;
              }
            }
          }
    }
    return cyFormat;
}

function fetchDataAndProcessData() 
{
    const file = new XMLHttpRequest();
    file.open('GET', 'test.csv', false); 
    file.send(null);
    if (file.status === 200) 
    {
        const data = file.responseText;
        const result = processData(data);
        return result;
    } 
    else 
    {
        console.error('Failed to fetch data');
    }
}

cyFormat = fetchDataAndProcessData() + ']';
console.log(cyFormat);
//var parsedcyFormat= JSON.parse(cyFormat);


//////////////////////////////////////////////
///// VISUALISATION

var cy = cytoscape({
  container: document.getElementById('cy'),
  elements: testcyto,
  style: [
    {
      selector: 'node',
      css: {
        width: 50,
        height: 50,
        'background-color':'#61bffc',
        content: 'data(id)'
      }
      
    }
    {
      selector: 'node.highlight',
      style: {
          'border-color': 'yellow',
          'background-color':'yellow',
          'border-width': '2px'
      }
  },
  {
      selector: 'node.semitransp',
      style:{ 'opacity': '0.5' }
  },
  {
      selector: 'edge.highlight',
      style: { 'mid-target-arrow-color': 'red' }
  },
  {
      selector: 'edge.semitransp',
      style:{ 'opacity': '0.2' }
  }
  ],
  layout: {
      name: 'breadthfirst',
      directed: true,
      padding: 10,
     /* color: "#ffff00",*/
      fit: true
  }
});

//////////////////////////////////////////////
//EXPORT FORMAT .png

var png64 = cy.png();

async function downloadImage(
  imageSrc,
  nameOfDownload = 'cy.png',
) {
  const response = await fetch(imageSrc);

  const blobImage = await response.blob();

  const href = URL.createObjectURL(blobImage);

  const anchorElement = document.createElement('a');
  anchorElement.href = href;
  anchorElement.download = nameOfDownload;

  document.body.appendChild(anchorElement);
  anchorElement.click();

  document.body.removeChild(anchorElement);
  window.URL.revokeObjectURL(href);
}

btn.addEventListener('click', () => {
  downloadImage(
    png64,
    'cy.png',
  )
    .then(() => {
      console.log('The image has been downloaded');
    })
    .catch(err => {
      console.log('Error downloading image: ', err);
    });
});

var neighbor;
function selection(){
  cy.on('tap', 'node', function(e) {
    var node = e.cyTarget;
    var directlyConnected = node.neighborhood();
    neighbor=directlyConnected.nodes().addClass('connectednodes');
    neighbor.addClass('highlight');
    return neighbor;

});
}
select.addEventListener('click',()=>{
  selection();
});
