import Helper from './Helper';
import itemType from './ItemType';

function openExternalLink(link) {
  window.open(link, '_blank');
}

export default function temClickedHandler(item) {
  switch (item.tclass) {
    case itemType.BOOK:
      openExternalLink(
        `${Helper.getBaseUrl()}index.html#book!${item.uid}`,
      );
      break;

    case itemType.PROJECT:
      openExternalLink(
        `${Helper.getBaseUrl()}index.html#project!${item.uid}`,
      );
      break;

    case itemType.SLIDE:
      openExternalLink(
        `${Helper.getBaseUrl()}index.html#slide!${item.uid}`,
      );
      break;

    default:
      break;
  }
}
