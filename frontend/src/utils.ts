export function getTabProps(index: number) {
  return {
    id: `navigation-tab-${index}`,
    "aria-controls": `navigation-tabpanel-${index}`,
  };
}

export function getCardmarketUrl(
  cardSetName: string, 
  cardName: string, 
  cardNumber?: string, 
  rarities?: string[]
): string {
  const formatForUrl = (str: string) => {
    return str
      .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens and spaces
      .trim()
      .replace(/\s+/g, '-'); // Replace spaces with hyphens
  };

  const formattedSetName = formatForUrl(cardSetName);
  
  // Build the full card name with card number prefix and rarity
  let fullCardName = cardName;
  
  // Extract version (V1, V2, etc.) from card number if present
  if (cardNumber) {
    const versionMatch = cardNumber.match(/-(V\d+)$/i);
    if (versionMatch) {
      fullCardName += ` ${versionMatch[1]}`;
    }
  }
  
  // Add the primary rarity if available
  if (rarities && rarities.length > 0) {
    fullCardName += ` ${rarities[0]}`;
  }
  
  const formattedCardName = formatForUrl(fullCardName);

  return `https://www.cardmarket.com/en/YuGiOh/Products/Singles/${formattedSetName}/${formattedCardName}?language=1&minCondition=4`;
}