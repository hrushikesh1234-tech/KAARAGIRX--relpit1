// Get dealer images based on 3-digit ID
export const getDealerImages = (dealerId: number | string, category: string): string[] => {
  const basePath = '/images/materials images';
  const idStr = String(dealerId).padStart(3, '0');
  const images: string[] = [];
  
  // Always return the first image path (a1.png)
  // The actual existence check will be handled by the image's onError handler
  const firstImagePath = `${basePath}/${category}/${idStr}/a1.png`;
  images.push(firstImagePath);
  
  // Add paths for additional images (a2.png through a10.png)
  for (let i = 2; i <= 10; i++) {
    images.push(`${basePath}/${category}/${idStr}/a${i}.png`);
  }
  
  return images;
};

// Fallback image paths for different categories
export const getFallbackImage = (category: string = 'default'): string => {
  const basePath = '/images/materials images';
  
  // Map categories to their respective default images
  const fallbackImages: Record<string, string> = {
    'cement': `${basePath}/cement/opc 43/a1.png`,
    'bricks': `${basePath}/bricks/fly ash/g1.png`,
    'sand': `${basePath}/sand/River Sand/j1.png`,
    'blocks': `${basePath}/blocks/AAC blocks/i1.png`,
    'steel': `${basePath}/steel/tmt bar/o1.png`,
    'rubblestone': `${basePath}/rubblestone/10mm Rubblestone/x1.png`,
    'stone-dust': `${basePath}/stone dust/Coarse Stone Dust/s1.png`,
    'aggregate': `${basePath}/aggregate/10mm Aggregate/t1.png`,
    'default': '/images/placeholder.jpg'  // Keep a generic fallback
  };

  const normalizedCategory = (category || '').toLowerCase().trim();
  return fallbackImages[normalizedCategory] || fallbackImages['default'];
};

// Mapping of subcategories to their respective image paths
const subcategoryImageMap: Record<string, string> = {
  // Cement
  'opc-43': '/images/materials images/cement/opc 43/a1.png',
  'opc 43': '/images/materials images/cement/opc 43/a1.png',
  'opc43': '/images/materials images/cement/opc 43/a1.png',
  'opc-53': '/images/materials images/cement/opc 53/b1.png',
  'opc 53': '/images/materials images/cement/opc 53/b1.png',
  'opc53': '/images/materials images/cement/opc 53/b1.png',
  'ppc': '/images/materials images/cement/ppc/c1.png',
  'pcc': '/images/materials images/cement/ppc/c1.png',
  'portland pozzolana cement': '/images/materials images/cement/ppc/c1.png',
  'rmc': '/images/materials images/cement/rmc/d1.png',
  'ready mix concrete': '/images/materials images/cement/rmc/d1.png',
  'white-cement': '/images/materials images/cement/white cement/e1.png',
  'white cement': '/images/materials images/cement/white cement/e1.png',
  'whitecement': '/images/materials images/cement/white cement/e1.png',
  
  // Bricks
  'red-clay': '/images/materials images/bricks/red clay/f1.png',
  'red clay': '/images/materials images/bricks/red clay/f1.png',
  'redclay': '/images/materials images/bricks/red clay/f1.png',
  'clay-bricks': '/images/materials images/bricks/red clay/f1.png',
  'clay bricks': '/images/materials images/bricks/red clay/f1.png',
  'claybricks': '/images/materials images/bricks/red clay/f1.png',
  
  'fly-ash': '/images/materials images/bricks/fly ash/g1.png',
  'fly ash': '/images/materials images/bricks/fly ash/g1.png',
  'flyash': '/images/materials images/bricks/fly ash/g1.png',
  'fly-ash-bricks': '/images/materials images/bricks/fly ash/g1.png',
  'fly ash bricks': '/images/materials images/bricks/fly ash/g1.png',
  'flyashbricks': '/images/materials images/bricks/fly ash/g1.png',
  
  // Blocks
  'concrete-blocks': '/images/materials images/blocks/Concrete Blocks/h1.png',
  'concrete blocks': '/images/materials images/blocks/Concrete Blocks/h1.png',
  'concreteblocks': '/images/materials images/blocks/Concrete Blocks/h1.png',
  'concrete': '/images/materials images/blocks/Concrete Blocks/h1.png',
  'solid-blocks': '/images/materials images/blocks/Concrete Blocks/h1.png',
  'solid blocks': '/images/materials images/blocks/Concrete Blocks/h1.png',
  'solidblocks': '/images/materials images/blocks/Concrete Blocks/h1.png',
  'hollow-blocks': '/images/materials images/blocks/Concrete Blocks/h1.png',
  'hollow blocks': '/images/materials images/blocks/Concrete Blocks/h1.png',
  'hollowblocks': '/images/materials images/blocks/Concrete Blocks/h1.png',
  
  'aac-blocks': '/images/materials images/blocks/AAC blocks/i1.png',
  'aac blocks': '/images/materials images/blocks/AAC blocks/i1.png',
  'aacblocks': '/images/materials images/blocks/AAC blocks/i1.png',
  'aac': '/images/materials images/blocks/AAC blocks/i1.png',
  'aac-block': '/images/materials images/blocks/AAC blocks/i1.png',
  'aac block': '/images/materials images/blocks/AAC blocks/i1.png',
  'aacblock': '/images/materials images/blocks/AAC blocks/i1.png',
  'autoclaved-aerated-concrete': '/images/materials images/blocks/AAC blocks/i1.png',
  'autoclaved aerated concrete': '/images/materials images/blocks/AAC blocks/i1.png',
  
  // Sand - River Sand
  'river-sand': '/images/materials images/sand/River Sand/j1.png',
  'river_sand': '/images/materials images/sand/River Sand/j1.png',
  'riversand': '/images/materials images/sand/River Sand/j1.png',
  'natural-sand': '/images/materials images/sand/River Sand/j1.png',
  'natural_sand': '/images/materials images/sand/River Sand/j1.png',
  'naturalsand': '/images/materials images/sand/River Sand/j1.png',
  'plastering-sand-river': '/images/materials images/sand/River Sand/j1.png',
  'plastering_sand_river': '/images/materials images/sand/River Sand/j1.png',
  'plasteringsandriver': '/images/materials images/sand/River Sand/j1.png',
  
  // Sand - Red Sand
  'red-sand': '/images/materials images/sand/Red Sand/k1.png',
  'red_sand': '/images/materials images/sand/Red Sand/k1.png',
  'redsand': '/images/materials images/sand/Red Sand/k1.png',
  'brick-sand': '/images/materials images/sand/Red Sand/k1.png',
  'brick_sand': '/images/materials images/sand/Red Sand/k1.png',
  'bricksand': '/images/materials images/sand/Red Sand/k1.png',
  'red-soil': '/images/materials images/sand/Red Sand/k1.png',
  'red_soil': '/images/materials images/sand/Red Sand/k1.png',
  'redsoil': '/images/materials images/sand/Red Sand/k1.png',
  
  // Sand - Coarse Sand
  'coarse-sand': '/images/materials images/sand/Coarse Sand/l1.png',
  'coarse_sand': '/images/materials images/sand/Coarse Sand/l1.png',
  'coarsesand': '/images/materials images/sand/Coarse Sand/l1.png',
  'coarse-grained-sand': '/images/materials images/sand/Coarse Sand/l1.png',
  'coarse_grained_sand': '/images/materials images/sand/Coarse Sand/l1.png',
  'coarsegrainedsand': '/images/materials images/sand/Coarse Sand/l1.png',
  'concrete-sand': '/images/materials images/sand/Coarse Sand/l1.png',
  'concrete_sand': '/images/materials images/sand/Coarse Sand/l1.png',
  'concretesand': '/images/materials images/sand/Coarse Sand/l1.png',
  'm-sand': '/images/materials images/sand/Coarse Sand/l1.png',
  'm_sand': '/images/materials images/sand/Coarse Sand/l1.png',
  'msand': '/images/materials images/sand/Coarse Sand/l1.png',
  'manufactured-sand': '/images/materials images/sand/Coarse Sand/l1.png',
  'manufactured_sand': '/images/materials images/sand/Coarse Sand/l1.png',
  'manufacturedsand': '/images/materials images/sand/Coarse Sand/l1.png',
  
  // Sand - Fine Sand
  'fine-sand': '/images/materials images/sand/Fine Sand/m1.png',
  'fine_sand': '/images/materials images/sand/Fine Sand/m1.png',
  'finesand': '/images/materials images/sand/Fine Sand/m1.png',
  'fine-grained-sand': '/images/materials images/sand/Fine Sand/m1.png',
  'fine_grained_sand': '/images/materials images/sand/Fine Sand/m1.png',
  'finegrainedsand': '/images/materials images/sand/Fine Sand/m1.png',
  'plaster-sand': '/images/materials images/sand/Fine Sand/m1.png',
  'plaster_sand': '/images/materials images/sand/Fine Sand/m1.png',
  'plastersand': '/images/materials images/sand/Fine Sand/m1.png',
  'plastering-sand-fine': '/images/materials images/sand/Fine Sand/m1.png',
  'plastering_sand_fine': '/images/materials images/sand/Fine Sand/m1.png',
  'plasteringsandfine': '/images/materials images/sand/Fine Sand/m1.png',
  
  // Sand - Filtered Sand
  'filtered-sand': '/images/materials images/sand/Filtered Sand/n1.png',
  'filtered_sand': '/images/materials images/sand/Filtered Sand/n1.png',
  'filteredsand': '/images/materials images/sand/Filtered Sand/n1.png',
  'washed-sand': '/images/materials images/sand/Filtered Sand/n1.png',
  'washed_sand': '/images/materials images/sand/Filtered Sand/n1.png',
  'washedsand': '/images/materials images/sand/Filtered Sand/n1.png',
  'clean-sand': '/images/materials images/sand/Filtered Sand/n1.png',
  'clean_sand': '/images/materials images/sand/Filtered Sand/n1.png',
  'cleansand': '/images/materials images/sand/Filtered Sand/n1.png',
  'screened-sand': '/images/materials images/sand/Filtered Sand/n1.png',
  'screened_sand': '/images/materials images/sand/Filtered Sand/n1.png',
  'screenedsand': '/images/materials images/sand/Filtered Sand/n1.png',
  
  // Steel - TMT Bars (Group 1)
  'tmt-bars': '/images/materials images/steel/tmt bar/o1.png',
  'tmt_bars': '/images/materials images/steel/tmt bar/o1.png',
  'tmtbars': '/images/materials images/steel/tmt bar/o1.png',
  'tmt': '/images/materials images/steel/tmt bar/o1.png',
  'tmt-steel': '/images/materials images/steel/tmt bar/o1.png',
  'tmt_steel': '/images/materials images/steel/tmt bar/o1.png',
  'tmtsteel': '/images/materials images/steel/tmt bar/o1.png',
  'thermomechanically-treated': '/images/materials images/steel/tmt bar/o1.png',
  'thermomechanically_treated': '/images/materials images/steel/tmt bar/o1.png',
  'thermomechanicallytreated': '/images/materials images/steel/tmt bar/o1.png',
  'steel-bars-tmt': '/images/materials images/steel/tmt bar/o1.png',
  'steel_bars_tmt': '/images/materials images/steel/tmt bar/o1.png',
  'steelbarstmt': '/images/materials images/steel/tmt bar/o1.png',
  'rebar': '/images/materials images/steel/tmt bar/o1.png',
  'reinforcement-bars': '/images/materials images/steel/tmt bar/o1.png',
  'reinforcement_bars': '/images/materials images/steel/tmt bar/o1.png',
  'reinforcementbars': '/images/materials images/steel/tmt bar/o1.png',
  
  // Steel - Binding Wire (Group 2)
  'binding-wire': '/images/materials images/steel/binding wire/p1.png',
  'binding_wire': '/images/materials images/steel/binding wire/p1.png',
  'bindingwire': '/images/materials images/steel/binding wire/p1.png',
  'tie-wire': '/images/materials images/steel/binding wire/p1.png',
  'tie_wire': '/images/materials images/steel/binding wire/p1.png',
  'tiewire': '/images/materials images/steel/binding wire/p1.png',
  'steel-wire': '/images/materials images/steel/binding wire/p1.png',
  'steel_wire': '/images/materials images/steel/binding wire/p1.png',
  'steelwire': '/images/materials images/steel/binding wire/p1.png',
  'annealed-wire': '/images/materials images/steel/binding wire/p1.png',
  'annealed_wire': '/images/materials images/steel/binding wire/p1.png',
  'annealedwire': '/images/materials images/steel/binding wire/p1.png',
  'tie-rod': '/images/materials images/steel/binding wire/p1.png',
  'tie_rod': '/images/materials images/steel/binding wire/p1.png',
  'tierod': '/images/materials images/steel/binding wire/p1.png',
  
  // Steel - Steel Rods (Group 3)
  'steel-rods': '/images/materials images/steel/steel rods/q1.png',
  'steel_rods': '/images/materials images/steel/steel rods/q1.png',
  'steelrods': '/images/materials images/steel/steel rods/q1.png',
  'steel-bars-rod': '/images/materials images/steel/steel rods/q1.png',
  'steel_bars_rod': '/images/materials images/steel/steel rods/q1.png',
  'steelbarsrod': '/images/materials images/steel/steel rods/q1.png',
  'steel-rounds': '/images/materials images/steel/steel rods/q1.png',
  'steel_rounds': '/images/materials images/steel/steel rods/q1.png',
  'steelrounds': '/images/materials images/steel/steel rods/q1.png',
  'mild-steel': '/images/materials images/steel/steel rods/q1.png',
  'mild_steel': '/images/materials images/steel/steel rods/q1.png',
  'mildsteel': '/images/materials images/steel/steel rods/q1.png',
  'ms-rods': '/images/materials images/steel/steel rods/q1.png',
  'ms_rods': '/images/materials images/steel/steel rods/q1.png',
  'msrods': '/images/materials images/steel/steel rods/q1.png',
  'ms-rounds': '/images/materials images/steel/steel rods/q1.png',
  'ms_rounds': '/images/materials images/steel/steel rods/q1.png',
  'msrounds': '/images/materials images/steel/steel rods/q1.png',
  'rods': '/images/materials images/steel/steel rods/q1.png',
  
  // Stone Dust - Fine
  'stone-dust': '/images/materials images/stone dust/Fine Stone Dust/r1.png',
  'stone_dust': '/images/materials images/stone dust/Fine Stone Dust/r1.png',
  'stonedust': '/images/materials images/stone dust/Fine Stone Dust/r1.png',
  'fine-stone-dust': '/images/materials images/stone dust/Fine Stone Dust/r1.png',
  'fine_stone_dust': '/images/materials images/stone dust/Fine Stone Dust/r1.png',
  'finestonetdust': '/images/materials images/stone dust/Fine Stone Dust/r1.png',
  'fine-dust': '/images/materials images/stone dust/Fine Stone Dust/r1.png',
  'fine_dust': '/images/materials images/stone dust/Fine Stone Dust/r1.png',
  'finedust': '/images/materials images/stone dust/Fine Stone Dust/r1.png',
  'stone-powder': '/images/materials images/stone dust/Fine Stone Dust/r1.png',
  'stone_powder': '/images/materials images/stone dust/Fine Stone Dust/r1.png',
  'stonepowder': '/images/materials images/stone dust/Fine Stone Dust/r1.png',
  'crusher-dust': '/images/materials images/stone dust/Fine Stone Dust/r1.png',
  'crusher_dust': '/images/materials images/stone dust/Fine Stone Dust/r1.png',
  'crusherdust': '/images/materials images/stone dust/Fine Stone Dust/r1.png',
  'stone-sand': '/images/materials images/stone dust/Fine Stone Dust/r1.png',
  'stone_sand': '/images/materials images/stone dust/Fine Stone Dust/r1.png',
  'stonesand': '/images/materials images/stone dust/Fine Stone Dust/r1.png',
  
  // Stone Dust - Coarse
  'coarse-stone-dust': '/images/materials images/stone dust/Coarse Stone Dust/s1.png',
  'coarse_stone_dust': '/images/materials images/stone dust/Coarse Stone Dust/s1.png',
  'coarsestonedust': '/images/materials images/stone dust/Coarse Stone Dust/s1.png',
  'coarse-dust': '/images/materials images/stone dust/Coarse Stone Dust/s1.png',
  'coarse_dust': '/images/materials images/stone dust/Coarse Stone Dust/s1.png',
  'coarsedust': '/images/materials images/stone dust/Coarse Stone Dust/s1.png',
  'quarry-dust': '/images/materials images/stone dust/Coarse Stone Dust/s1.png',
  'quarry_dust': '/images/materials images/stone dust/Coarse Stone Dust/s1.png',
  'quarrydust': '/images/materials images/stone dust/Coarse Stone Dust/s1.png',
  'grit': '/images/materials images/stone dust/Coarse Stone Dust/s1.png',
  'stone-grit': '/images/materials images/stone dust/Coarse Stone Dust/s1.png',
  'stone_grit': '/images/materials images/stone dust/Coarse Stone Dust/s1.png',
  'stonegrit': '/images/materials images/stone dust/Coarse Stone Dust/s1.png',
  'stone-chips': '/images/materials images/stone dust/Coarse Stone Dust/s1.png',
  'stone_chips': '/images/materials images/stone dust/Coarse Stone Dust/s1.png',
  'stonechips': '/images/materials images/stone dust/Coarse Stone Dust/s1.png',
  'blue-metal-dust': '/images/materials images/stone dust/Coarse Stone Dust/s1.png',
  'blue_metal_dust': '/images/materials images/stone dust/Coarse Stone Dust/s1.png',
  'bluemetaldust': '/images/materials images/stone dust/Coarse Stone Dust/s1.png',
  
  // Aggregate - 10mm (Group 1)
  '10mm-aggregate': '/images/materials images/aggregate/10mm Aggregate/t1.png',
  '10mm_aggregate': '/images/materials images/aggregate/10mm Aggregate/t1.png',
  '10mmaggregate': '/images/materials images/aggregate/10mm Aggregate/t1.png',
  '10mm-size': '/images/materials images/aggregate/10mm Aggregate/t1.png',
  '10mm_size': '/images/materials images/aggregate/10mm Aggregate/t1.png',
  '10mmsize': '/images/materials images/aggregate/10mm Aggregate/t1.png',
  '10mm-metal': '/images/materials images/aggregate/10mm Aggregate/t1.png',
  '10mm_metal': '/images/materials images/aggregate/10mm Aggregate/t1.png',
  '10mmmetal': '/images/materials images/aggregate/10mm Aggregate/t1.png',
  '10mm-blue-metal': '/images/materials images/aggregate/10mm Aggregate/t1.png',
  '10mm_blue_metal': '/images/materials images/aggregate/10mm Aggregate/t1.png',
  '10mmbluemetal': '/images/materials images/aggregate/10mm Aggregate/t1.png',
  '10mm-jelly': '/images/materials images/aggregate/10mm Aggregate/t1.png',
  '10mm_jelly': '/images/materials images/aggregate/10mm Aggregate/t1.png',
  '10mmjelly': '/images/materials images/aggregate/10mm Aggregate/t1.png',
  '10mm-gravel': '/images/materials images/aggregate/10mm Aggregate/t1.png',
  '10mm_gravel': '/images/materials images/aggregate/10mm Aggregate/t1.png',
  '10mmgravel': '/images/materials images/aggregate/10mm Aggregate/t1.png',
  'small-aggregate': '/images/materials images/aggregate/10mm Aggregate/t1.png',
  'small_aggregate': '/images/materials images/aggregate/10mm Aggregate/t1.png',
  'smallaggregate': '/images/materials images/aggregate/10mm Aggregate/t1.png',
  
  // Aggregate - 20mm (Group 2)
  '20mm-aggregate': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  '20mm_aggregate': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  '20mmaggregate': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  '20mm-size': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  '20mm_size': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  '20mmsize': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  '20mm-metal': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  '20mm_metal': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  '20mmmetal': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  '20mm-blue-metal': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  '20mm_blue_metal': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  '20mmbluemetal': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  '20mm-jelly': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  '20mm_jelly': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  '20mmjelly': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  '20mm-gravel': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  '20mm_gravel': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  '20mmgravel': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  'standard-aggregate': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  'standard_aggregate': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  'standardaggregate': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  'coarse-aggregate': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  'coarse_aggregate': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  'coarseaggregate': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  'medium-aggregate': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  'medium_aggregate': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  'mediumaggregate': '/images/materials images/aggregate/20mm Aggregate/u1.png',
  
  // Aggregate - 40mm (Group 3)
  '40mm-aggregate': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  '40mm_aggregate': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  '40mmaggregate': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  '40mm-size': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  '40mm_size': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  '40mmsize': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  '40mm-metal': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  '40mm_metal': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  '40mmmetal': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  '40mm-blue-metal': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  '40mm_blue_metal': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  '40mmbluemetal': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  '40mm-jelly': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  '40mm_jelly': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  '40mmjelly': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  '40mm-gravel': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  '40mm_gravel': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  '40mmgravel': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  'large-aggregate': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  'large_aggregate': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  'largeaggregate': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  'single-size-aggregate': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  'single_size_aggregate': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  'singlesizeaggregate': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  'ssa': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  'big-size-aggregate': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  'big_size_aggregate': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  'bigsizeaggregate': '/images/materials images/aggregate/40mm Aggregate/v1.png',
  
  // Aggregate - Dust (Group 4)
  'aggregate-dust': '/images/materials images/aggregate/Aggregate Dust/w1.png',
  'aggregate_dust': '/images/materials images/aggregate/Aggregate Dust/w1.png',
  'aggregatedust': '/images/materials images/aggregate/Aggregate Dust/w1.png',
  'quarry-dust-aggr': '/images/materials images/aggregate/Aggregate Dust/w1.png',
  'quarry_dust_aggr': '/images/materials images/aggregate/Aggregate Dust/w1.png',
  'quarrydustaggr': '/images/materials images/aggregate/Aggregate Dust/w1.png',
  'crusher-dust-aggr': '/images/materials images/aggregate/Aggregate Dust/w1.png',
  'crusher_dust_aggr': '/images/materials images/aggregate/Aggregate Dust/w1.png',
  'crusherdustaggr': '/images/materials images/aggregate/Aggregate Dust/w1.png',
  'dust-aggregate': '/images/materials images/aggregate/Aggregate Dust/w1.png',
  'dust_aggregate': '/images/materials images/aggregate/Aggregate Dust/w1.png',
  'dustaggregate': '/images/materials images/aggregate/Aggregate Dust/w1.png',
  'fine-aggregate-dust': '/images/materials images/aggregate/Aggregate Dust/w1.png',
  'fine_aggregate_dust': '/images/materials images/aggregate/Aggregate Dust/w1.png',
  'fineaggregatedust': '/images/materials images/aggregate/Aggregate Dust/w1.png',
  'stone-dust-aggr': '/images/materials images/aggregate/Aggregate Dust/w1.png',
  'stone_dust_aggr': '/images/materials images/aggregate/Aggregate Dust/w1.png',
  'stonedustaggr': '/images/materials images/aggregate/Aggregate Dust/w1.png',
  // Rubblestone - 10mm (Group 1)
  '10mm-rubble': '/images/materials images/rubblestone/10mm Rubblestone/x1.png',
  '10mm_rubble': '/images/materials images/rubblestone/10mm Rubblestone/x1.png',
  '10mmrubble': '/images/materials images/rubblestone/10mm Rubblestone/x1.png',
  '10mm-rubble-stone': '/images/materials images/rubblestone/10mm Rubblestone/x1.png',
  '10mm_rubble_stone': '/images/materials images/rubblestone/10mm Rubblestone/x1.png',
  '10mmrubble_stone': '/images/materials images/rubblestone/10mm Rubblestone/x1.png',
  '10mm-stone-rubble': '/images/materials images/rubblestone/10mm Rubblestone/x1.png',
  '10mm_stone_rubble': '/images/materials images/rubblestone/10mm Rubblestone/x1.png',
  '10mmstonerubble': '/images/materials images/rubblestone/10mm Rubblestone/x1.png',
  'small-rubble-10mm': '/images/materials images/rubblestone/10mm Rubblestone/x1.png',
  'small_rubble_10mm': '/images/materials images/rubblestone/10mm Rubblestone/x1.png',
  'smallrubble10mm': '/images/materials images/rubblestone/10mm Rubblestone/x1.png',
  'small-rubble-stone-10mm': '/images/materials images/rubblestone/10mm Rubblestone/x1.png',
  'small_rubble_stone_10mm': '/images/materials images/rubblestone/10mm Rubblestone/x1.png',
  'smallrubble_stone_10mm': '/images/materials images/rubblestone/10mm Rubblestone/x1.png',
  '10mm-gravel-rubble': '/images/materials images/rubblestone/10mm Rubblestone/x1.png',
  '10mm_gravel_rubble': '/images/materials images/rubblestone/10mm Rubblestone/x1.png',
  '10mmgravelrubble': '/images/materials images/rubblestone/10mm Rubblestone/x1.png',
  'small-gravel-10mm': '/images/materials images/rubblestone/10mm Rubblestone/x1.png',
  'small_gravel_10mm': '/images/materials images/rubblestone/10mm Rubblestone/x1.png',
  'smallgravel10mm': '/images/materials images/rubblestone/10mm Rubblestone/x1.png',
  
  // Rubblestone - 20mm (Group 2)
  '20mm-rubblestone': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  '20mm_rubblestone': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  '20mmrubblestone': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  '20mm-rubble': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  '20mm_rubble': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  '20mmrubble': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  '20mm-rubble-stone': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  '20mm_rubble_stone': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  '20mmrubble_stone': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  'medium-rubble-20mm': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  'medium_rubble_20mm': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  'mediumrubble20mm': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  'standard-rubble-20mm': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  'standard_rubble_20mm': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  'standardrubble20mm': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  '20mm-stone-rubble': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  '20mm_stone_rubble': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  '20mmstonerubble': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  '20mm-gravel-rubble': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  '20mm_gravel_rubble': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  '20mmgravelrubble': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  'medium-gravel-20mm': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  'medium_gravel_20mm': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  'mediumgravel20mm': '/images/materials images/rubblestone/20mm Rubblestone/y1.png',
  
  // Rubblestone - 40mm (Group 3)
  '40mm-rubblestone': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  '40mm_rubblestone': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  '40mmrubblestone': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  '40mm-rubble': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  '40mm_rubble': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  '40mmrubble': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  '40mm-rubble-stone': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  '40mm_rubble_stone': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  '40mmrubble_stone': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  'large-rubble-40mm': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  'large_rubble_40mm': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  'largerubble40mm': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  'big-rubble-40mm': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  'big_rubble_40mm': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  'bigrubble40mm': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  '40mm-stone-rubble': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  '40mm_stone_rubble': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  '40mmstonerubble': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  '40mm-gravel-rubble': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  '40mm_gravel_rubble': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  '40mmgravelrubble': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  'large-gravel-40mm': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  'large_gravel_40mm': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  'largegravel40mm': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  'big-gravel-40mm': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  'big_gravel_40mm': '/images/materials images/rubblestone/40mm Rubblestone/z1.png',
  'biggravel40mm': '/images/materials images/rubblestone/40mm Rubblestone/z1.png'
};

// Utility function to get the correct image path for a dealer
export const getDealerImagePath = (dealer: { subcategory?: string; category?: string } = {}): string => {
  try {
    if (!dealer || !dealer.subcategory) {
      console.warn('Missing dealer subcategory, using fallback image');
      return getFallbackImage(dealer?.category);
    }
    
    // Normalize the subcategory (convert to lowercase and trim)
    const normalizedSubcategory = dealer.subcategory.toLowerCase().trim();
    
    // Try to find a matching image path
    const imagePath = subcategoryImageMap[normalizedSubcategory];
    
    if (imagePath) {
      console.log(`Found image for subcategory '${dealer.subcategory}':`, imagePath);
      return imagePath;
    }
    
    // If no exact match, try to find a partial match
    const matchingKey = Object.keys(subcategoryImageMap).find(key => 
      normalizedSubcategory.includes(key) || 
      key.includes(normalizedSubcategory)
    );
    
    if (matchingKey) {
      console.log(`Found partial match for subcategory '${dealer.subcategory}':`, matchingKey);
      return subcategoryImageMap[matchingKey];
    }
    
    // If no match found, use the fallback based on category
    console.warn(`No image found for subcategory '${dealer.subcategory}', using category fallback`);
    return getFallbackImage(dealer.category);
  } catch (error) {
    console.error('Error getting dealer image path:', error);
    return getFallbackImage(dealer?.category);
  }
};

// Function to get dealer-specific image path
export const getDealerImageById = (dealerId: number, imageType: 'logo' | 'main' | 'gallery' | 'product', imageName?: string): string => {
  const basePath = `/images/dealers/${dealerId}`;
  
  switch (imageType) {
    case 'logo':
      return `${basePath}/logo.png`;
    case 'main':
      return `${basePath}/main.jpg`;
    case 'gallery':
      return `${basePath}/gallery/${imageName || '1'}.jpg`;
    case 'product':
      return `${basePath}/products/${imageName || '1'}.jpg`;
    default:
      return getFallbackImage();
  }
};

// Function to get the main product image for a dealer
export const getDealerProductImage = (dealer: { id: number; category?: string }, imageName?: string): string => {
  if (!dealer || !dealer.id) {
    return getFallbackImage(dealer?.category);
  }
  return getDealerImageById(dealer.id, 'product', imageName);
};

// Function to get the dealer's logo
