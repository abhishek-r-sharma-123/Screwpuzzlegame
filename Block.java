// Pseudocode for a dependency structure
const disassemblyOrder = },
    { id: 'screw_blue_2', type: 'screw', targetBlock: 'block_top_right', prerequisites: },
    { id: 'block_top_left', type: 'block', prerequisites: ['screw_red_1'] },
    { id: 'block_top_right', type: 'block', prerequisites: ['screw_blue_2'] },
    { id: 'screw_green_3', type: 'screw', targetBlock: 'block_middle', prerequisites: ['block_top_left', 'block_top_right'] },
    { id: 'block_middle', type: 'block', prerequisites: ['screw_green_3'] }
    //... and so on for all parts
];

let removedParts = new Set(); // To track what's been removed
