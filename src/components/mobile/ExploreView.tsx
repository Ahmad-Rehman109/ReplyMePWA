import { motion } from 'motion/react';
import { useState } from 'react';
import { templates } from '../../lib/templates';
import type { Template, ToneType } from '../../types';

interface ExploreViewProps {
  onTemplateSelect: (scenario: string, tone: ToneType) => void;
}

export function ExploreView({ onTemplateSelect }: ExploreViewProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'dating' | 'friends' | 'trending'>('all');

  const categories = [
    { id: 'all' as const, label: 'All', icon: '✨' },
    { id: 'dating' as const, label: 'Dating', icon: '💕' },
    { id: 'friends' as const, label: 'Friends', icon: '👥' },
    { id: 'trending' as const, label: 'Trending', icon: '🔥' },
  ];

  const categoryColors = {
    dating: '#FF6B6B',
    friends: '#FFB84D',
    trending: '#00E5A8'
  };

  const filteredTemplates = activeCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  return (
    <div className="pb-24 px-6 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="mb-2" style={{ color: '#e6eef8' }}>
          Explore Templates
        </h1>
        <p style={{ color: '#9aa4b2' }}>
          Quick-start scenarios for common situations
        </p>
      </motion.div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className="px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap"
            style={{
              background: activeCategory === category.id
                ? 'rgba(124, 92, 255, 0.2)'
                : 'rgba(255, 255, 255, 0.05)',
              border: activeCategory === category.id
                ? '1px solid #7C5CFF'
                : '1px solid rgba(255, 255, 255, 0.1)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{category.icon}</span>
            <span 
              className="text-sm"
              style={{ color: activeCategory === category.id ? '#7C5CFF' : '#9aa4b2' }}
            >
              {category.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="space-y-3">
        {filteredTemplates.map((template, index) => (
          <motion.button
            key={template.id}
            onClick={() => onTemplateSelect(template.scenario, template.suggestedTone)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="w-full p-4 rounded-2xl text-left"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${categoryColors[template.category]}20`,
                  border: `1px solid ${categoryColors[template.category]}40`
                }}
              >
                <span className="text-xl">{template.icon}</span>
              </div>
              <div className="flex-1">
                <h4 className="mb-1" style={{ color: '#e6eef8' }}>
                  {template.title}
                </h4>
                <p className="text-sm mb-2" style={{ color: '#9aa4b2' }}>
                  {template.scenario}
                </p>
                <div className="flex items-center gap-2">
                  <span 
                    className="text-xs px-2 py-1 rounded-lg"
                    style={{
                      background: `${categoryColors[template.category]}20`,
                      color: categoryColors[template.category]
                    }}
                  >
                    {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                  </span>
                  <span className="text-xs" style={{ color: '#9aa4b2' }}>
                    • Suggested: {template.suggestedTone}
                  </span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
