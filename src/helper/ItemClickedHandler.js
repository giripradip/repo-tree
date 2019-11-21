import UrlHelper from './UrlHelper';

export default function temClickedHandler(item) {
  window.open(`${UrlHelper.BASE_URL}/index.html#${item.tclass}!${item.uid}`, '_blank');
}
