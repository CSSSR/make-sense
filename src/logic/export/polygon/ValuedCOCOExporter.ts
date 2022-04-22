import {ImageData, LabelName, LabelPolygon} from '../../../store/labels/types';
import {
    ValuedCOCOAnnotation
} from '../../../data/labels/COCO';
import {flatten} from 'lodash';
import {COCOExporter} from './COCOExporter';

export type LabelDataMap = { [key: string]: number; }

export class ValuedCOCOExporter extends COCOExporter{
    public static getAnnotationsComponent(imagesData: ImageData[], labelNames: LabelName[]): ValuedCOCOAnnotation[] {
        const labelsMap: LabelDataMap = ValuedCOCOExporter.mapLabelsData(labelNames);
        let id = 0;
        const annotations: ValuedCOCOAnnotation[][] = imagesData
            .filter((imagesData: ImageData) => imagesData.loadStatus)
            .filter((imagesData: ImageData) => imagesData.labelPolygons.length !== 0)
            .map((imageData: ImageData, index: number) => {
                return imageData.labelPolygons.map((labelPolygon: LabelPolygon): ValuedCOCOAnnotation => {
                    return {
                        'id': id++,
                        'iscrowd': 0,
                        'image_id': index + 1,
                        'category_id': labelsMap[labelPolygon.labelId],
                        'value': labelPolygon.labelValue,
                        'segmentation': ValuedCOCOExporter.getCOCOSegmentation(labelPolygon.vertices),
                        'bbox': ValuedCOCOExporter.getCOCOBbox(labelPolygon.vertices),
                        'area': ValuedCOCOExporter.getCOCOArea(labelPolygon.vertices)
                    }
                })
            })
        return flatten(annotations);
    }
}