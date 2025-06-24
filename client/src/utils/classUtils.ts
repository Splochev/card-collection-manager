export function mapPropsToClasses(
  props: Record<string, any>,
  classMappings: Record<string, string | string[]>,
) {
  const classes: string[] = []

  for (const [key, value] of Object.entries(classMappings)) {
    if (key === 'linkVariant' && props.variant === 'link') {
      classes.push(...(value as string[]))
    } else if (key === 'iconVariant' && props.variant === 'icon') {
      classes.push(...(value as string[]))
    } else if (props[key] && props[key] !== 'default') {
      classes.push(`${value}${props[key]}`)
    }
  }

  if (props.class) {
    classes.push(props.class)
  }

  return classes
}
