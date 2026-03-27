// COLORS
export const COLORS = {
  bg:    '#1A1815',
  bgAlt: '#2A2520',
  text:  '#E8E0D0',
}

// FONTS
export const FONTS = {
  serif: "'Noto Serif KR',Georgia,serif",
  sans:  'system-ui,sans-serif',
  mono:  "'D2Coding',ui-monospace,monospace",
}

// fadeStyle utility — dy: translateY offset in px when hidden (default 6)
export const fadeStyle = (show, dy = 6) => ({
  opacity: show ? 1 : 0,
  transform: show ? 'translateY(0)' : `translateY(${dy}px)`,
  transition: 'opacity 0.7s ease, transform 0.7s ease',
})

// CSS keyframes strings (for <style> injection)
export const KEYFRAMES = {
  fadeUp: '@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}',
  fadeIn: '@keyframes fadeIn{from{opacity:0}to{opacity:1}}',
}
