export const IMPACT_METRICS = [
  "82% Research time saved",
  "10ms Avg query latency",
  "95% Model Accuracy",
  "40% Reduction in GPU cost",
  "2.5x Faster Training",
  "99.9% RAG Precision",
  "15% Increase in User Engagement",
  "Sub-100ms Inference Speed"
];

export function getImpactMetric(id: string) {
  // Use the ID to deterministicly pick a metric
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return IMPACT_METRICS[index % IMPACT_METRICS.length];
}

export const PROJECT_IMAGES = [
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1620712943543-bcc4628c71d5?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&q=80&w=800"
];

export function getProjectImage(id: string) {
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PROJECT_IMAGES[index % PROJECT_IMAGES.length];
}
