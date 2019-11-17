import EducationWrapper from './EducationWrapper';

export default class Education extends EducationWrapper {
  constructor(name, children) {
    super(name, children);
    this.uid = null;
  }
}
