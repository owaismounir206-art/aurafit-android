import { describe, it, expect } from 'vitest';
import { ClusterEngine, CLUSTERS } from '../src/core/clusterEngine';

describe('ClusterEngine - Biomechanical Sport Clusters', () => {
  it('should define all 4 required biomechanical clusters', () => {
    expect(CLUSTERS.CLUSTER_A).toBeDefined();
    expect(CLUSTERS.CLUSTER_B).toBeDefined();
    expect(CLUSTERS.CLUSTER_C).toBeDefined();
    expect(CLUSTERS.CLUSTER_D).toBeDefined();
  });

  it('should map sports correctly to their respective clusters', () => {
    // Cluster A: Situazionali & Squadra
    expect(ClusterEngine.getClusterForSport('soccer').id).toBe('CLUSTER_A');
    expect(ClusterEngine.getClusterForSport('basketball').id).toBe('CLUSTER_A');
    expect(ClusterEngine.getClusterForSport('padel').id).toBe('CLUSTER_A');
    expect(ClusterEngine.getClusterForSport('volleyball').id).toBe('CLUSTER_A');

    // Cluster B: Forza & Skill
    expect(ClusterEngine.getClusterForSport('gym').id).toBe('CLUSTER_B');
    expect(ClusterEngine.getClusterForSport('calisthenics').id).toBe('CLUSTER_B');
    expect(ClusterEngine.getClusterForSport('powerlifting').id).toBe('CLUSTER_B');

    // Cluster C: Endurance & Ciclici
    expect(ClusterEngine.getClusterForSport('running').id).toBe('CLUSTER_C');
    expect(ClusterEngine.getClusterForSport('cycling').id).toBe('CLUSTER_C');
    expect(ClusterEngine.getClusterForSport('swimming').id).toBe('CLUSTER_C');

    // Cluster D: Combat & Reattività
    expect(ClusterEngine.getClusterForSport('boxing').id).toBe('CLUSTER_D');
    expect(ClusterEngine.getClusterForSport('mma').id).toBe('CLUSTER_D');
    expect(ClusterEngine.getClusterForSport('bjj').id).toBe('CLUSTER_D');
  });

  it('should specify correct minimum target BPM per cluster', () => {
    expect(CLUSTERS.CLUSTER_A.minBpmTarget).toBe(130);
    expect(CLUSTERS.CLUSTER_B.minBpmTarget).toBe(120);
    expect(CLUSTERS.CLUSTER_C.minBpmTarget).toBe(135);
    expect(CLUSTERS.CLUSTER_D.minBpmTarget).toBe(140);
  });

  it('should provide targeted injury prevention exercises for each cluster', () => {
    const clusterA = CLUSTERS.CLUSTER_A;
    const lcaExercise = clusterA.sampleRoutine.find(e => e.injuryPreventionTarget.includes('LCA'));
    expect(lcaExercise).toBeDefined();
    expect(lcaExercise?.name).toContain('Drop Jumps');

    const pubalgiaExercise = clusterA.sampleRoutine.find(e => e.injuryPreventionTarget.includes('Pubalgia'));
    expect(pubalgiaExercise).toBeDefined();
    expect(pubalgiaExercise?.name).toContain('Copenhagen');
  });
});
